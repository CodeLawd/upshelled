import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { MongoClient } from "mongodb";
import { seedData } from "./src/seeder.js";
import jwt from "jsonwebtoken";
import { isLoggedIn } from "./src/auth.js";
import cors from "cors";

const app = express();

app.use(cors());

// Initializing the database
export const client = new MongoClient(process.env.MONGODB_URL, { useNewUrlParser: true });
export const db = client.db(process.env.DB_NAME);
const database = async () => {
  try {
    await client.connect();
    await db.command({ ping: 1 });
    console.log("Connected successfully to Database");
  } catch (error) {
    throw new error(error);
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

  const token = jwt.sign({ username: user.seller_id }, process.env.SECRET_KEY, { expiresIn: "5d" });

  return res.status(200).json({
    success: true,
    token,
    user,
  });
});

// Get all orders for logged in user
app.get("/order_items", isLoggedIn, async (req, res) => {
  let { limit, skip } = req.query;

  // Check if limit if given or default it to 20
  limit = +limit || 20;
  if (limit < 1) limit = 20;

  skip = +skip || 0;
  if (skip < 1) skip = 0;

  const orders = await db.collection("orders").find({ seller_id: req.user.username }).skip(skip).limit(limit).toArray();
  // Get total
  const total = await db.collection("orders").countDocuments({});
  return res.status(200).json({
    data: orders,
    total,
    limit,
    offset: skip,
  });
});

// Get Order with Order ID
app.get("/order_items/:orderId", isLoggedIn, async (req, res) => {
  const { orderId } = req.params;
  const order = await db.collection("orders").findOne({ order_id: orderId });

  if (!order)
    return res.status(404).json({
      success: false,
      message: "There is not order with that id",
    });

  return res.status(200).json({
    success: true,
    data: order,
  });
});

app.patch("/order_items/:orderId", isLoggedIn, async (req, res) => {
  console.log(req.params);
  const user = await db
    .collection("orders")
    .findOneAndUpdate({ order_id: req.params.orderId }, { $set: { ...req.body } }, { returnDocument: "after" });

  return res.status(200).json({
    success: true,
    data: user.value,
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
