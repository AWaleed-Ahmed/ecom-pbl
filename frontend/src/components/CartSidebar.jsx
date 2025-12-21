import axios from "axios";

function CartSidebar({
  showCart,
  cart,
  cartTotal,
  onClose,
  onRemoveFromCart,
  onUpdateQuantity,
  user,
}) {
  if (!showCart) return null;

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    try {
      const orderId = Date.now();
      console.log("Placing order:", {
        userId: user.userId,
        orderId,
        items: cart,
      });

      const response = await axios.post("http://localhost:3000/api/orders", {
        userId: user.userId,
        orderId: orderId,
        items: cart.map((item) => ({
          productId: item.productId || item.id,
          quantity: item.quantity,
        })),
      });

      console.log("Order response:", response.data);

      if (response.data.success) {
        alert(`Order placed successfully! Order ID: ${orderId}`);
        // Clear cart from backend
        for (const item of cart) {
          await axios.delete(
            `http://localhost:3000/api/cart/${user.userId}/remove/${
              item.productId || item.id
            }`
          );
        }
        onClose();
        window.location.reload();
      } else {
        alert("Order placement failed. Please try again.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      console.error("Error response:", error.response?.data);
      alert(
        `Failed to place order: ${
          error.response?.data?.error || error.message || "Unknown error"
        }`
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-dark/20 z-40" onClick={onClose}>
      <div
        className="absolute left-0 top-17 bottom-0 w-full max-w-md bg-white shadow-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-end mb-6">
            <button
              onClick={onClose}
              className="text-dark hover:text-primary transition-colors cursor-pointer"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-dark/60 mb-2">Your cart is empty</p>
              <p className="text-sm text-dark/40">
                Add some products to get started
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-background p-4 border border-dark/5"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-4xl text-dark uppercase">
                          {item.name}
                        </h3>
                        <p className="text-2xl font-mono text-primary mt-2">
                          £{item.price.toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => onRemoveFromCart(item.id)}
                        className="text-dark/40 hover:text-primary transition-colors cursor-pointer"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="w-8 h-8 bg-white hover:bg-dark/5 flex items-center justify-center transition-colors border border-dark/10 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="font-mono font-semibold min-w-8 text-center text-dark">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="w-8 h-8 bg-white hover:bg-dark/5 flex items-center justify-center transition-colors border border-dark/10 cursor-pointer"
                      >
                        +
                      </button>
                      <span className="ml-auto font-mono font-semibold text-dark">
                        £{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-dark/10 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-dark">TOTAL</span>
                  <span className="text-2xl font-bold text-dark font-mono">
                    £{cartTotal.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-primary hover:bg-primary/90 text-dark font-medium py-3 transition-all cursor-pointer"
                >
                  CHECKOUT
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CartSidebar;
