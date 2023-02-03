import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { MongoClient } from "mongodb";
import { seedData } from "./seeder.js";
import jwt from "jsonwebtoken";
import { isLoggedIn } from "./auth.js";

const app = express();

// Initializing the database
export const client = new MongoClient(process.env.MONGODB_URL, { useNewUrlParser: true });
export const db = client.db(process.env.DB_NAME);
const database = async () => {
  try {
    await client.connect();
    await db.command({ ping: 1 });
    console.log("Connected successfully to Database");
  } finally {
    // await client.close();
  }
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = 8080;

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await db.collection("sellers").findOne({ seller_id: username });

  if (!user)
    return res.status(404).json({
      success: false,
      message: `There is no user with username of ${username}`,
    });

  // Match password
  const isMatch = password === user.seller_zip_code_prefix;

  if (!isMatch)
    return res.status(404).json({
      success: false,
      message: `Password is incorrect`,
    });

  const token = jwt.sign({ username: user.seller_id }, process.env.SECRET_KEY);

  return res.status(200).json({
    success: true,
    token,
  });
});

// Get all orders for logged in user
app.get("/order_items", isLoggedIn, async (req, res) => {
  const orders = await db.collection("orders").find({ seller_id: req.user.username }).toArray();
  return res.status(200).json({
    success: true,
    data: orders,
  });
});

// Delete Order with Order ID
app.delete("/order_items/:orderId", isLoggedIn, async (req, res) => {
  const { orderId } = req.params;
  await db.collection("orders").findOneAndDelete({ order_id: orderId });
  return res.status(200).json({
    success: true,
    message: `Order with id ${orderId} has been deleted successfully`,
  });
});

// Update logged in seller's city or/and state.
app.patch("/account", isLoggedIn, async (req, res) => {
  const user = await db
    .collection("sellers")
    .findOneAndUpdate({ seller_id: req.user.username }, { $set: { ...req.body } }, { returnDocument: "after" });

  return res.status(200).json({
    success: true,
    data: user.value,
  });
});

app.listen(PORT, async () => {
  console.log(`Server started on port ${PORT}`);
  database();
  seedData();
});
