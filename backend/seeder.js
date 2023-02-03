import csvtojson from "csvtojson";
import { db } from "./server.js";

export const seedData = () => {
  // Seed sellers data
  csvtojson()
    .fromFile("./data/olist_sellers_dataset.csv")
    .then((jsonObj) => {
      const sellers = db.collection("sellers");
      sellers && sellers.drop();
      sellers.insertMany(jsonObj);
    })
    .catch((err) => console.log(err));

  // Seed orders data
  csvtojson()
    .fromFile("./data/olist_order_items_dataset.csv")
    .then((jsonObj) => {
      const orders = db.collection("orders");
      orders && orders.drop();
      orders.insertMany(jsonObj);
    })
    .catch((err) => console.log(err));

  // // Seed products data
  csvtojson()
    .fromFile("./data/olist_products_dataset.csv")
    .then((jsonObj) => {
      const products = db.collection("products");
      products && products.drop();
      products.insertMany(jsonObj);
    })
    .catch((err) => console.log(err));

  console.log("Database seeded!");
};
