/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";

function DialogProduct({ open, setOpen, product }) {
  if (!open) return null;
  const dispatch = useDispatch()

  // Tạo mảng images với id duy nhất cho mỗi ảnh
  const imagesWithIds = product.images.map((image, index) => ({
    id: `${product._id}-${index}`, // Tạo id duy nhất bằng product id + index
    url: image
  }));

  const [selectedImage, setSelectedImage] = useState(imagesWithIds[0].url);
  const [selectedImageId, setSelectedImageId] = useState(imagesWithIds[0].id);

  const handleImageClick = (image) => {
    setSelectedImage(image.url);
    setSelectedImageId(image.id);
  };

  const { addToCart } = useCart();
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(1);

  const handleClick = () => {
    navigate(`/product/${product.slug}`)
    window.scrollTo(0, 0);
  }

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1) {
      setQuantity(value);
    }
  };

  const handleBuyNow = () => {
      dispatch(addToCart({ ...product, cartQuantity: quantity }));
      navigate("/checkout");
      window.scrollTo(0, 0);
    };
  
  const user = JSON.parse(localStorage.getItem("user"));
  const handleAddToCart = async () => {
    if (!user?._id) {
      navigate("/login");
      return;
    }

    const result = await addToCart(user._id, product._id, quantity);
    
    if (result.success) {
      setOpen(false);
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-[10000000]">
      <div className="absolute inset-0 bg-black opacity-50" onClick={() => setOpen(false)}></div>

      <div className="bg-white p-6 rounded-lg shadow-lg w-[900px] relative z-10">
        <IoIosCloseCircle className="size-6 absolute -top-3 -right-3 text-amber-50" onClick={()=>setOpen(false)}/>

        <div className="flex gap-5">
          <div className="w-1/2 flex flex-col justify-center items-center gap-6">
            <div className="w-full max-w-[500px] overflow-hidden rounded-lg shadow-[rgba(0,_0,_0,_0.25)_0px_25px_50px_-12px]">
              <img
                src={selectedImage}
                alt="Selected Product"
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex justify-center gap-3 flex-wrap">
              {imagesWithIds.map((image) => (
                <div
                  key={image.id}
                  className={`size-16 md:size-20 cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    selectedImageId === image.id ? "border-amber-500 scale-110" : "border-transparent hover:border-amber-300"
                  }`}
                  onClick={() => handleImageClick(image)}
                >
                  <img
                    src={image.url}
                    alt={`Thumbnail ${image.id}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="w-1/2 flex flex-col gap-7">
            <Link to={`/product/${product.slug}`} className="font-bold text-2xl text-[#333] text-brown-hover transition-colors duration-150">{product.name}</Link>
            <span>Thương hiệu: Khác | Tình trạng: {product.sold === product.stock ? "Hết hàng":"Còn hàng"}</span>
            <div className="bg-brown w-44 text-center p-1 skew-x-[-15deg] ml-1">
              <h2 className="text-2xl text-white font-bold">
                {new Intl.NumberFormat('vi-VN').format(quantity * product.price)}đ
              </h2>
            </div>
            <div className="flex items-center gap-5">
              <span className="text-gray-700">Số lượng: </span>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors duration-200"
                  onClick={handleDecrease}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-5 border-x-2 border-gray-300">{quantity}</span>
                <button
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors duration-200"
                  onClick={handleIncrease}
                >
                  +
                </button>
              </div>
            </div>
            <button onClick={()=>handleAddToCart()} className="w-60 border-2 text-white bg-brown hover:bg-white rounded-[5px] hover:border-[#d06a03] py-2 transition-colors duration-200">Thêm vào giỏ hàng</button>
            <button onClick={()=>handleBuyNow()} className="w-60 border-2 text-white bg-brown hover:bg-white rounded-[5px] hover:border-[#d06a03] py-2 transition-colors duration-200">Mua ngay</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DialogProduct;