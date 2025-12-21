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
      const response = await axios.post("http://localhost:3000/api/orders", {
        userId: user.id,
        orderId: orderId,
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      });

      if (response.data.success) {
        alert(`Order placed successfully! Order ID: ${orderId}`);
        for (const item of cart) {
          await axios.delete(
            `http://localhost:3000/api/cart/${user.id}/${item.id}`
          );
        }
        onClose();
        window.location.reload();
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-dark/50 z-50" onClick={onClose}>
      <div
        className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-dark">YOUR CART</h2>
            <button
              onClick={onClose}
              className="text-dark hover:text-primary transition-colors"
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
                    className="bg-background rounded-lg p-4 border border-dark/5"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-dark uppercase text-sm">
                          {item.name}
                        </h3>
                        <p className="text-sm font-mono text-primary mt-1">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => onRemoveFromCart(item.id)}
                        className="text-dark/40 hover:text-primary transition-colors"
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
                        className="w-8 h-8 bg-white hover:bg-dark/5 rounded flex items-center justify-center transition-colors border border-dark/10"
                      >
                        -
                      </button>
                      <span className="font-mono font-semibold min-w-8 text-center text-dark">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="w-8 h-8 bg-white hover:bg-dark/5 rounded flex items-center justify-center transition-colors border border-dark/10"
                      >
                        +
                      </button>
                      <span className="ml-auto font-mono font-semibold text-dark">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-dark/10 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-dark">TOTAL</span>
                  <span className="text-2xl font-bold text-dark font-mono">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-primary hover:bg-primary/90 text-dark font-medium py-3 rounded transition-all"
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
