import { useEffect, useState } from "react";
import api from "../services/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await api.get("/product"); 
        console.log(res.data); 
        setProducts(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Products</h1>
      {products.length === 0 ? (
        <p className="text-center">No products found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition"
            >
              {product.image && (
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-48 w-full object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold">{product.title}</h2>
                <p className="text-gray-600 text-sm mb-2">
                  {product.short_description}
                </p>
                <p className="text-lg font-bold text-blue-600">
                  ₹{product.price}
                </p>
                <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;
