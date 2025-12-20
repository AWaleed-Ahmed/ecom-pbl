import { useState, useEffect } from "react";
import SaleBanner from "./components/SaleBanner";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CartSidebar from "./components/CartSidebar";
import ProductGrid from "./components/ProductGrid";

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
      <SaleBanner />

      <Navbar
        cartCount={cartCount}
        onCartClick={() => setShowCart(!showCart)}
      />

      <CartSidebar
        showCart={showCart}
        cart={cart}
        cartTotal={cartTotal}
        onClose={() => setShowCart(false)}
        onRemoveFromCart={removeFromCart}
        onUpdateQuantity={updateQuantity}
      />

      <Hero />

      <main className="container mx-auto px-12 pb-16">
        <ProductGrid
          products={products}
          loading={loading}
          onAddToCart={addToCart}
        />
      </main>
    </div>
  );
}

export default App;
