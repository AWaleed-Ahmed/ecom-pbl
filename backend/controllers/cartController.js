import { runCppProgram } from "../utils/cppHelper.js";

export const getCart = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Call C++ to get cart from linked list
    const output = await runCppProgram(["get-cart", userId]);

    // Parse C++ output
    const lines = output.trim().split("\n");
    const cartItems = [];

    for (const line of lines) {
      if (line.includes("Product ID") && line.includes("Quantity")) {
        continue; // Skip header
      }
      if (line.includes("Cart is empty")) {
        break;
      }
      if (line.includes("|")) {
        const parts = line.split("|").map((p) => p.trim());
        if (parts.length >= 2 && !isNaN(parts[0])) {
          cartItems.push({
            productId: parseInt(parts[0]),
            quantity: parseInt(parts[1]),
          });
        }
      }
    }

    // Get product details for each cart item
    const items = [];
    for (const item of cartItems) {
      try {
        const productOutput = await runCppProgram([
          "search-product",
          item.productId.toString(),
        ]);

        // Parse product details from output
        const nameMatch = productOutput.match(/Name: (.+)/);
        const priceMatch = productOutput.match(/Price: ([\d.]+)/);

        if (nameMatch && priceMatch) {
          items.push({
            productId: item.productId,
            quantity: item.quantity,
            name: nameMatch[1],
            price: parseFloat(priceMatch[1]),
          });
        }
      } catch (error) {
        console.error(`Failed to get product ${item.productId}:`, error);
      }
    }

    res.json({ items, total: 0 });
  } catch (error) {
    console.error("Error getting cart:", error);
    res.status(500).json({ error: "Failed to get cart" });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { productId, quantity } = req.body;

    // Call C++ to add to linked list cart
    await runCppProgram([
      "add-to-cart",
      userId.toString(),
      productId.toString(),
      (quantity || 1).toString(),
    ]);

    // Get updated cart
    const output = await runCppProgram(["get-cart", userId]);

    res.json({ success: true, message: "Item added to cart" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Failed to add to cart" });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    const productId = req.params.productId;

    // Call C++ to remove from linked list cart
    await runCppProgram([
      "remove-from-cart",
      userId.toString(),
      productId.toString(),
    ]);

    res.json({ success: true, message: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ error: "Failed to remove from cart" });
  }
};
