import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Trash2, X } from "lucide-react";

function Admin({ onBack }) {
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    id: "",
    name: "",
    price: "",
    stock: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/products");
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Check if product ID already exists
    const existingProduct = products.find(
      (p) => p.id === parseInt(newProduct.id)
    );
    if (existingProduct) {
      alert(
        `Product ID ${newProduct.id} already exists! Please use a different ID.`
      );
      setLoading(false);
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/products", {
        id: parseInt(newProduct.id),
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
      });

      alert("Product added successfully!");
      setNewProduct({ id: "", name: "", price: "", stock: "" });
      setShowAddForm(false);
      fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
      alert(
        "Failed to add product: " +
          (error.response?.data?.error || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProduct = async (productId) => {
    if (!confirm(`Are you sure you want to remove product #${productId}?`)) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/api/products/${productId}`);
      alert("Product removed successfully!");
      fetchProducts();
    } catch (error) {
      console.error("Error removing product:", error);
      alert(
        "Failed to remove product: " +
          (error.response?.data?.error || error.message)
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-dark text-white py-6">
        <div className="container mx-auto px-8 flex items-center justify-between">
          <h1 className="text-3xl text-primary/90">PRODUCT MANAGER</h1>
          <button
            onClick={onBack}
            className="bg-primary text-background px-6 py-2 font-mono hover:bg-primary/90 transition-colors cursor-pointer"
          >
            BACK TO STORE
          </button>
        </div>
      </div>

      <div className="container mx-auto px-8 py-8">
        {/* Add Product Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-primary text-dark px-6 py-3 font-mono flex items-center gap-2 hover:bg-primary/90 transition-colors cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            ADD NEW PRODUCT
          </button>
        </div>

        {/* Add Product Form */}
        {showAddForm && (
          <div className="bg-white p-6 mb-8 border border-dark/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl text-dark">ADD NEW PRODUCT</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-dark/60 hover:text-primary cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-dark mb-2">
                    PRODUCT ID
                  </label>
                  <input
                    type="number"
                    required
                    value={newProduct.id}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, id: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-dark/20 focus:outline-none focus:border-primary"
                    placeholder="101"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-dark mb-2">
                    PRODUCT NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-dark/20 focus:outline-none focus:border-primary"
                    placeholder="Product Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-dark mb-2">
                    PRICE (£)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-dark/20 focus:outline-none focus:border-primary"
                    placeholder="29.99"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-dark mb-2">
                    STOCK
                  </label>
                  <input
                    type="number"
                    required
                    value={newProduct.stock}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, stock: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-dark/20 focus:outline-none focus:border-primary"
                    placeholder="100"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-dark text-background font-mono px-8 py-2 hover:text-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {loading ? "ADDING..." : "ADD PRODUCT"}
              </button>
            </form>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white border border-dark/10">
          <div className="p-4 border-b border-dark/10">
            <h2 className="text-2xl text-dark">
              ALL PRODUCTS ({products.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-dark uppercase">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-dark uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-dark uppercase">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-dark uppercase">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-dark uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark/10">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-dark/5">
                    <td className="px-6 py-4 text-sm font-mono text-dark">
                      {product.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-dark font-semibold">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-dark">
                      £{product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-dark">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleRemoveProduct(product.id)}
                        className="text-red-600 hover:text-red-800 transition-colors cursor-pointer"
                        title="Remove Product"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
