import { CirclePlus } from "lucide-react";

function ProductGrid({ products, loading, onAddToCart }) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
        <p className="mt-4 text-dark/60">Loading products...</p>
      </div>
    );
  }

  return (
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
                onClick={() => onAddToCart(product)}
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
                <span className="text-[0.8rem] text-dark">4.9(67 Reviews)</span>
              </div>
              <div className="text-dark text-xl font-bold">
                £{product.price.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductGrid;
