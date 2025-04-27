import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MainLayout from "../layout/mainLayout";
import axiosInstance from "../utils/axiosInstance";
import Product from "../components/Product";
import { ScaleLoader } from "react-spinners";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("q");

    if (query) {
      setSearchTerm(query);
      performSearch(query);
    }
  }, [location.search]);

  const performSearch = async (query) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setHasSearched(true);

    try {
      const response = await axiosInstance.get(
        `/api/products/search?q=${query}`
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error searching products:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    performSearch(searchTerm);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product.slug}`);
  };

  return (
    <MainLayout>
      <div className="container px-4 md:px-6 lg:px-8 mx-auto py-8 max-w-7xl">
        <div className="mb-8 space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Tìm kiếm sản phẩm
          </h1>

          <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="flex-grow">
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown focus:border-transparent transition-all"
                placeholder="Nhập từ khóa tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <button
              className="px-6 py-3 bg-[#e17100] text-white rounded-lg hover:bg-[#e17000d2] transition-colors duration-200 font-medium cursor-pointer shadow-md "
              onClick={handleSearch}
            >
              Tìm kiếm
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center my-12">
            <ScaleLoader color="#c49a6c" />
          </div>
        )}

        {!isLoading && hasSearched && (
          <div className="space-y-6">
            <p className="text-gray-600">
              {searchResults.length > 0 ? (
                <>
                  Tìm thấy{" "}
                  <span className="font-medium">{searchResults.length}</span>{" "}
                  kết quả phù hợp với từ khóa "
                  <span className="font-medium">{searchTerm}</span>"
                </>
              ) : (
                <>
                  Không tìm thấy sản phẩm nào phù hợp với từ khóa "
                  <span className="font-medium">{searchTerm}</span>"
                </>
              )}
            </p>

            {searchResults.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {searchResults.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => handleProductClick(product)}
                    className="cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <Product product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Search;
