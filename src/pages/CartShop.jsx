import { useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layout/mainLayout";
import Breadcrumb2 from "../components/Breadcrumb2";
import { FaTrash } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const links = [
  { label: "Trang chủ", href: "/" },
  { label: "Giỏ hàng của bạn", href: "/cart" },
];

const CartShop = () => {
  // Sử dụng CartContext để lấy dữ liệu giỏ hàng và các hàm cần thiết
  const { cartItems, updateCartItemQuantity, removeFromCart, clearCart } =
    useCart();
  const [isClearing, setIsClearing] = useState(false);

  // Tính tổng tiền
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.product_id?.price || 0) * item.quantity,
    0
  );
  const user = JSON.parse(localStorage.getItem("user"));

  // Hàm xử lý xóa tất cả sản phẩm
  const handleClearCart = async () => {
    if (!user?._id) {
      alert("Vui lòng đăng nhập để thực hiện thao tác này.");
      return;
    }

    const result = await Swal.fire({
      title: "Bạn có chắc chắn?",
      text: "Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      setIsClearing(true); // Bật trạng thái loading
      const clearResult = await clearCart(user._id);
      setIsClearing(false); // Tắt trạng thái loading

      if (!clearResult.success) {
        toast.error(clearResult.message);
      }
    }
  };

  return (
    <MainLayout>
      {/* Breadcrumb */}
      <Breadcrumb2 links={links} banner={null} />

      <div className="max-w-5xl mx-auto p-6">
        {/* Tiêu đề */}
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Giỏ hàng của bạn
        </h1>

        {/* Khung chứa cả danh sách sản phẩm & tổng tiền */}
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
          {cartItems.length > 0 ? (
            <>
              {/* Nút Xóa Tất Cả */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={handleClearCart} // Mở modal khi nhấn nút
                  className=" cursor-pointer bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-200"
                >
                  Xóa tất cả
                </button>
              </div>
              {/* Danh sách sản phẩm */}
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-300 text-gray-700">
                    <th className="p-3">Sản phẩm</th>
                    <th className="p-3">Giá</th>
                    <th className="p-3">Số lượng</th>
                    <th className="p-3">Thành tiền</th>
                    <th className="p-3">Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr
                      key={item._id}
                      className="border-b border-gray-200 transition-all duration-300 min-h-[80px]"
                    >
                      <td className="p-5 flex items-center gap-6">
                        {/* Link đến trang chi tiết sản phẩm */}
                        <Link
                          to={`/product/${item.product_id?.slug}`}
                          className="flex items-center gap-6 hover:text-[#c49a6c] transition-colors duration-200"
                        >
                          <img
                            src={item.product_id?.images[0]}
                            alt={item.product_id?.name}
                            className="w-20 h-20 rounded-md shadow-sm border border-gray-200 object-cover"
                          />
                          <span>{item.product_id?.name}</span>
                        </Link>
                      </td>

                      <td className="p-5 text-gray-700 w-32">
                        {(item.product_id?.price || 0).toLocaleString()}đ
                      </td>

                      <td className="p-5 w-32 text-center">
                        <div className="flex items-center justify-center border border-gray-300 rounded-lg w-28 shadow-sm">
                          {/* Nút Giảm */}
                          <button
                            onClick={() => {
                              if (item.quantity === 1) {
                                removeFromCart(user._id, item._id);
                              } else {
                                updateCartItemQuantity(
                                  user._id,
                                  item._id,
                                  item.quantity - 1
                                );
                              }
                            }}
                            className="px-3 py-2 text-gray-700 rounded-l-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                          >
                            -
                          </button>

                          {/* Số Lượng (Cho phép nhập + Ẩn nút tăng giảm mặc định) */}
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === "") {
                                updateCartItemQuantity(user._id, item._id, ""); // Nếu rỗng thì chờ nhập số
                              } else {
                                const newQuantity = parseInt(value, 10);
                                if (!isNaN(newQuantity) && newQuantity >= 1) {
                                  updateCartItemQuantity(
                                    user._id,
                                    item._id,
                                    newQuantity
                                  );
                                }
                              }
                            }}
                            onBlur={(e) => {
                              if (
                                !e.target.value ||
                                parseInt(e.target.value, 10) < 1
                              ) {
                                updateCartItemQuantity(user._id, item._id, 1);
                              }
                            }}
                            className="w-10 text-center border-x border-gray-300 bg-white text-gray-800 appearance-none custom-number-input"
                          />

                          {/* Nút Tăng */}
                          <button
                            onClick={() =>
                              updateCartItemQuantity(
                                user._id,
                                item._id,
                                item.quantity + 1
                              )
                            }
                            className="px-3 py-2 text-gray-700 rounded-r-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      <td className="p-5 w-32 text-center">
                        {(
                          (item.product_id?.price || 0) * item.quantity
                        ).toLocaleString()}
                        đ
                      </td>

                      <td className="p-5 w-16 text-center">
                        <button
                          onClick={() => removeFromCart(user._id, item._id)}
                          className="cursor-pointer text-red-500 hover:text-red-700 transition text-lg"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Tổng tiền - Được đặt trong cùng khung với bảng sản phẩm */}
              <div className="flex justify-end items-center mt-6 p-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Tổng số thành tiền:{" "}
                  <span className="text-brown">
                    {totalPrice.toLocaleString()}đ
                  </span>
                </h2>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500 py-6">
              Giỏ hàng của bạn đang trống!
            </p>
          )}
        </div>

        {/* Nút điều hướng */}
        <div className="mt-6 flex justify-between">
          <Link
            to="/"
            className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition"
          >
            ← Tiếp tục mua hàng
          </Link>

          {cartItems.length > 0 && (
            <Link
              to="/checkout"
              className="bg-brown text-white py-2 px-4 rounded-lg shadow-md border-brown-hover transition"
            >
              Tiến hành thanh toán →
            </Link>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default CartShop;
