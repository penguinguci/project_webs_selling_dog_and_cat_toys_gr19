import express from 'express';
import {
    countCartItems,
    deleteAllProductsFromCart,
    deleteProductFromCart,
    deleteCart,
    updateCart,
    getCartByUserId,
    addToCart
} from '../controllers/cartController.js';

const router = express.Router();

// Thêm sản phẩm vào giỏ hàng
router.post('/', addToCart);

// Lấy giỏ hàng theo user_id
router.get('/:user_id', getCartByUserId);

// Cập nhật giỏ hàng
router.put('/:user_id', updateCart);

// Xóa sản phẩm khỏi giỏ hàng
router.delete('/:user_id/:product_id', deleteProductFromCart);

// Xóa tất cả sản phẩm khỏi giỏ hàng
router.delete('/:user_id', deleteAllProductsFromCart);

// Xóa giỏ hàng
router.delete('/:user_id', deleteCart);

// Đếm số lượng sản phẩm trong giỏ hàng
router.get('/count/:user_id', countCartItems);