import { runCppProgram } from "../utils/cppHelper.js";

export const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const output = await runCppProgram(["search-by-name", query]);

    if (output.includes("No products found")) {
      return res.json({ products: [] });
    }

    // Parse the output format: id|name|price|stock
    const lines = output
      .trim()
      .split("\n")
      .filter((line) => line.includes("|"));
    const products = lines.map((line) => {
      const [id, name, price, stock] = line.split("|");
      return {
        id: parseInt(id),
        name: name,
        price: parseFloat(price),
        stock: parseInt(stock),
      };
    });

    res.json({ products });
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ error: "Failed to search products" });
  }
};
