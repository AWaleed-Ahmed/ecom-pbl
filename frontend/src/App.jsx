import { useState, useEffect } from "react";
import { CirclePlus } from "lucide-react";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/products");
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, change) => {
    setCart(
      cart
        .map((item) => {
          if (item.id === productId) {
            const newQuantity = item.quantity + change;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Sale Strip */}
      <div className="bg-dark py-1.5 text-center">
        <p className="text-primary text-[0.64rem] font-light tracking-wide">
          SALE 50% OFF - LIMITED TIME ONLY!
        </p>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-white border-b border-dark/10 sticky top-0 z-50">
        <div className="container mx-auto px-8 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-dark tracking-tight">MOSS</h1>
          <button
            onClick={() => setShowCart(!showCart)}
            className="font-mono text-dark text-lg hover:text-primary transition-colors relative"
          >
            CART
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-6 bg-primary text-dark w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Cart Sidebar */}
      {showCart && (
        <div
          className="fixed inset-0 bg-dark/50 z-50"
          onClick={() => setShowCart(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-dark">YOUR CART</h2>
                <button
                  onClick={() => setShowCart(false)}
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
                            onClick={() => removeFromCart(item.id)}
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
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-8 h-8 bg-white hover:bg-dark/5 rounded flex items-center justify-center transition-colors border border-dark/10"
                          >
                            -
                          </button>
                          <span className="font-mono font-semibold min-w-[2rem] text-center text-dark">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
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
                    <button className="w-full bg-primary hover:bg-primary/90 text-dark font-bold py-3 rounded transition-all">
                      CHECKOUT
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="container mx-auto px-12 py-16">
        <h2 className="text-5xl md:text-6xl text-dark leading-none mb-8">
          DISCOVER
          <br />
          EVERYTHING YOU
          <br />
          NEED IN ONE PLACE
        </h2>
        <div className="h-0.5 bg-[#b8a48b9e] max-w-[100%]"></div>
      </section>

      {/* Products Section */}
      <main className="container mx-auto px-12 pb-16">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
            <p className="mt-4 text-dark/60">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Product Image */}
                <div className="aspect-square bg-white flex items-center justify-center">
                  <span className="text-6xl">📦</span>
                </div>

                {/* Product Name and Add Button */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-[0.9rem] text-dark uppercase flex-1">
                      {product.name}
                    </h3>
                    <button
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0}
                      className={`transition-colors ${
                        product.stock > 0
                          ? "text-primary hover:text-primary/70"
                          : "text-dark/20 cursor-not-allowed"
                      }`}
                    >
                      <CirclePlus className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Price and Rating Section */}
                  <div className="bg-[#ebebea] -mx-4 -mb-4 px-3.5 py-3 border-t-[0.09rem] border-dark/10 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-orange-500 text-lg">★</span>
                      <span className="text-[0.8rem] text-dark">
                        4.9(67 Reviews)
                      </span>
                    </div>
                    <div className="text-dark text-xl font-bold">
                      £{product.price.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
