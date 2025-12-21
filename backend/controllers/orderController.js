import { runCppProgram } from "../utils/cppHelper.js";

export const getAllOrders = async (req, res) => {
  try {
    const output = await runCppProgram(["list-orders"]);

    if (output.includes("No orders")) {
      return res.json([]);
    }

    const lines = output.trim().split("\n");
    const orders = lines
      .filter((line) => line.includes("Order ID:"))
      .map((line) => {
        // Parse output from C++ Order display
        const orderIdMatch = line.match(/Order ID: (\d+)/);
        const totalMatch = line.match(/Total Price: ([\d.]+)/);
        const statusMatch = line.match(/Status: (\w+)/);

        return {
          orderId: orderIdMatch ? parseInt(orderIdMatch[1]) : 0,
          totalPrice: totalMatch ? parseFloat(totalMatch[1]) : 0,
          status: statusMatch ? statusMatch[1] : "Pending",
        };
      })
      .filter((order) => order.orderId > 0);

    res.json(orders);
  } catch (error) {
    console.error("Error getting orders:", error);
    res.status(500).json({ error: "Failed to get orders" });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { userId, orderId, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Build command args: place-order userId orderId productId1 qty1 productId2 qty2 ...
    const args = ["place-order", userId.toString(), orderId.toString()];
    items.forEach((item) => {
      args.push(item.productId.toString());
      args.push(item.quantity.toString());
    });

    const output = await runCppProgram(args);

    if (output.includes("Cart is empty")) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    res.json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};
