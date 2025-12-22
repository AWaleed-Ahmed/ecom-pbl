import { useState, useEffect } from "react";
import axios from "axios";
import Auth from "./pages/Auth";
import SaleBanner from "./components/SaleBanner";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CartSidebar from "./components/CartSidebar";
import ProductGrid from "./components/ProductGrid";
import Recommendations from "./components/Recommendations";
import Footer from "./components/Footer";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    fetchProducts();

    // Check for stored user
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      setIsAuthenticated(true);
      loadCart(user.userId);
    }
  }, []);

  // Search products when query changes
  useEffect(() => {
    const searchProducts = async () => {
      if (!searchQuery.trim()) {
        setFilteredProducts(products);
        return;
      }

      try {
        const { data } = await axios.get(
          `http://localhost:3000/api/search?query=${encodeURIComponent(
            searchQuery
          )}`
        );
        setFilteredProducts(data.products);
      } catch (error) {
        console.error("Failed to search products:", error);
        setFilteredProducts([]);
      }
    };

    searchProducts();
  }, [searchQuery, products]);

  const loadCart = async (userId) => {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/api/cart/${userId}`
      );
      // Convert backend cart format to frontend format
      const cartItems = data.items.map((item) => ({
        id: item.productId,
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));
      setCart(cartItems);
    } catch (error) {
      console.error("Failed to load cart:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/products");
      setProducts(data);
      setFilteredProducts(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setLoading(false);
    }
  };

  const addToCart = async (product) => {
    if (!currentUser) return;

    try {
      // Update backend
      await axios.post(
        `http://localhost:3000/api/cart/${currentUser.userId}/add`,
        {
          productId: product.id,
          quantity: 1,
          name: product.name,
          price: product.price,
        }
      );

      // Update local state
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
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const removeFromCart = async (productId) => {
    if (!currentUser) return;

    try {
      // Update backend
      await axios.delete(
        `http://localhost:3000/api/cart/${currentUser.userId}/remove/${productId}`
      );

      // Update local state
      setCart(cart.filter((item) => item.id !== productId));
    } catch (error) {
      console.error("Failed to remove from cart:", error);
    }
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

  const handleUserSelect = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    loadCart(user.userId);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("currentUser");
    setCart([]);
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Show auth page if not authenticated
  if (!isAuthenticated) {
    return <Auth onAuthSuccess={handleUserSelect} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <SaleBanner />

      <Navbar
        cartCount={cartCount}
        currentUser={currentUser}
        onCartClick={() => setShowCart(!showCart)}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <CartSidebar
        showCart={showCart}
        cart={cart}
        cartTotal={cartTotal}
        onClose={() => setShowCart(false)}
        onRemoveFromCart={removeFromCart}
        onUpdateQuantity={updateQuantity}
        user={currentUser}
      />

      <Hero />

      <main className="container mx-auto pb-16">
        <ProductGrid
          products={filteredProducts}
          loading={loading}
          onAddToCart={addToCart}
        />
      </main>

      {products.length > 0 && (
        <Recommendations
          productId={
            cart.length > 0
              ? cart[cart.length - 1]?.productId || cart[cart.length - 1]?.id
              : 1
          }
          products={products}
          onAddToCart={addToCart}
        />
      )}

      <Footer />
    </div>
  );
}

export default App;
