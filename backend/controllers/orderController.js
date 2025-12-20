import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_DIR = path.join(__dirname, "../../data");

export const getAllOrders = (req, res) => {
  const ordersFile = path.join(DATA_DIR, "orders.txt");

  if (fs.existsSync(ordersFile)) {
    fs.readFile(ordersFile, "utf8", (err, data) => {
      if (err) {
        return res.status(500).json({ error: "Failed to read orders" });
      }

      const lines = data.trim().split("\n");
      const orders = lines.map((line) => {
        const [orderId, totalPrice, status] = line.split(" ");
        return {
          orderId: parseInt(orderId),
          totalPrice: parseFloat(totalPrice),
          status: status,
        };
      });

      res.json(orders);
    });
  } else {
    res.json([]);
  }
};

export const createOrder = (req, res) => {
  const { orderId, productIds, totalPrice, status } = req.body;

  const ordersFile = path.join(DATA_DIR, "orders.txt");
  const newOrder = `${orderId} ${totalPrice} ${status}\n`;

  fs.appendFileSync(ordersFile, newOrder);

  res.json({ success: true, message: "Order placed successfully" });
};
