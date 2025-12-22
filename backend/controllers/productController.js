import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { runCppProgram } from "../utils/cppHelper.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_DIR = path.join(__dirname, "../../data");
const USE_CPP = false; // Set to true when C++ executable is ready

export const getAllProducts = async (req, res) => {
  if (USE_CPP) {
    try {
      const output = await runCppProgram(["list-products"]);

      // Parse C++ output
      const products = output
        .split("\n")
        .filter((line) => line.trim() && line.includes("ID:"))
        .map((line) => {
          const idMatch = line.match(/ID:\s*(\d+)/);
          const nameMatch = line.match(/Name:\s*([^,]+)/);
          const priceMatch = line.match(/Price:\s*([\d.]+)/);
          const stockMatch = line.match(/Stock:\s*(\d+)/);

          return {
            id: idMatch ? parseInt(idMatch[1]) : null,
            name: nameMatch ? nameMatch[1].trim() : "",
            price: priceMatch ? parseFloat(priceMatch[1]) : 0,
            stock: stockMatch ? parseInt(stockMatch[1]) : 0,
          };
        });

      res.json(products);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to fetch products", details: error.message });
    }
  } else {
    // Fallback: Read from CSV
    const productsFile = path.join(DATA_DIR, "products.csv");

    if (fs.existsSync(productsFile)) {
      fs.readFile(productsFile, "utf8", (err, data) => {
        if (err) {
          return res.status(500).json({ error: "Failed to read products" });
        }

        const lines = data.trim().split("\n");
        const products = [];

        for (let i = 1; i < lines.length; i++) {
          const [id, name, price, stock] = lines[i].split(",");
          products.push({
            id: parseInt(id),
            name: name,
            price: parseFloat(price),
            stock: parseInt(stock),
          });
        }

        res.json(products);
      });
    } else {
      res.json([]);
    }
  }
};

export const getProductById = async (req, res) => {
  const productId = req.params.id;

  if (USE_CPP) {
    try {
      const output = await runCppProgram(["search-product", productId]);

      if (output.includes("Product found")) {
        // Parse the product details from output
        const lines = output.split("\n");
        const productLine = lines.find((line) => line.includes("ID:"));

        if (productLine) {
          const idMatch = productLine.match(/ID:\s*(\d+)/);
          const nameMatch = productLine.match(/Name:\s*([^,]+)/);
          const priceMatch = productLine.match(/Price:\s*([\d.]+)/);
          const stockMatch = productLine.match(/Stock:\s*(\d+)/);

          return res.json({
            id: idMatch ? parseInt(idMatch[1]) : null,
            name: nameMatch ? nameMatch[1].trim() : "",
            price: priceMatch ? parseFloat(priceMatch[1]) : 0,
            stock: stockMatch ? parseInt(stockMatch[1]) : 0,
          });
        }
      }

      res.status(404).json({ error: "Product not found" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to search product", details: error.message });
    }
  } else {
    // Fallback: Read from CSV
    const productsFile = path.join(DATA_DIR, "products.csv");

    if (fs.existsSync(productsFile)) {
      fs.readFile(productsFile, "utf8", (err, data) => {
        if (err) {
          return res.status(500).json({ error: "Failed to read products" });
        }

        const lines = data.trim().split("\n");

        for (let i = 1; i < lines.length; i++) {
          const [id, name, price, stock] = lines[i].split(",");
          if (id === productId) {
            return res.json({
              id: parseInt(id),
              name: name,
              price: parseFloat(price),
              stock: parseInt(stock),
            });
          }
        }

        res.status(404).json({ error: "Product not found" });
      });
    } else {
      res.status(404).json({ error: "No products available" });
    }
  }
};

export const addProduct = async (req, res) => {
  try {
    const { id, name, price, stock } = req.body;

    if (!id || !name || !price || !stock) {
      return res.status(400).json({ error: "All fields are required" });
    }

    await runCppProgram([
      "add-product",
      id.toString(),
      name,
      price.toString(),
      stock.toString(),
    ]);

    res.json({ success: true, message: "Product added successfully" });
  } catch (error) {
    console.error("Error adding product:", error);
    res
      .status(500)
      .json({ error: "Failed to add product", details: error.message });
  }
};

export const removeProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    await runCppProgram(["remove-product", id]);

    res.json({ success: true, message: "Product removed successfully" });
  } catch (error) {
    console.error("Error removing product:", error);
    res
      .status(500)
      .json({ error: "Failed to remove product", details: error.message });
  }
};

export const getRecommendations = async (req, res) => {
  const productId = req.params.id;

  if (USE_CPP) {
    try {
      const output = await runCppProgram(["get-recommendations", productId]);

      // Parse recommendations from output
      const recommendations = output
        .split("\n")
        .filter((line) => line.trim() && /^\d+/.test(line))
        .map((id) => ({ id: parseInt(id.trim()) }));

      res.json({
        productId: parseInt(productId),
        recommendations: recommendations,
      });
    } catch (error) {
      res.status(500).json({
        error: "Failed to get recommendations",
        details: error.message,
      });
    }
  } else {
    // Fallback: Mock data
    res.json({
      productId: parseInt(productId),
      recommendations: [
        { id: 2, name: "Related Product 1" },
        { id: 3, name: "Related Product 2" },
      ],
    });
  }
};
