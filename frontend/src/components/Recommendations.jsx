import { useState, useEffect } from "react";
import axios from "axios";
import { CirclePlus } from "lucide-react";

function Recommendations({ productId, products, onAddToCart }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productId) return;

    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/recommendations/${productId}`
        );

        // Get full product details for recommended IDs
        const recommendedProducts = products.filter((p) =>
          response.data.recommendations.includes(p.id)
        );

        setRecommendations(recommendedProducts);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [productId, products]);

  if (loading || recommendations.length === 0) return null;

  return (
    <div
      className="border-t border-dark/10 py-12 pb-16"
      style={{ backgroundColor: "#F2F0E6" }}
    >
      <div className="container mx-auto">
        <h2 className="text-3xl font-medium text-dark mb-6">
          YOU MAY ALSO LIKE
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recommendations.slice(0, 4).map((product) => (
            <div
              key={product.id}
              className="bg-white overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-square bg-white flex items-center justify-center">
                <span className="text-5xl">📦</span>
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-xs text-dark uppercase flex-1 truncate">
                    {product.name}
                  </h3>
                  <button
                    onClick={() => onAddToCart(product)}
                    disabled={product.stock === 0}
                    className={`transition-colors ${
                      product.stock > 0
                        ? "text-primary hover:text-primary/70 cursor-pointer"
                        : "text-dark/20 cursor-not-allowed"
                    }`}
                  >
                    <CirclePlus className="w-6 h-6" />
                  </button>
                </div>
                <div className="text-dark text-lg font-bold">
                  £{product.price.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Recommendations;
