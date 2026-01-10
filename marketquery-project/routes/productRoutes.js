const express = require('express');
const router = express.Router();
const productController = require('../Controllers/productController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');
const apiGuard = require('../middleware/apiGuard');
// IMPORT MIDDLEWARE UPLOAD YANG SUDAH KAMU BUAT TADI
const upload = require('../middleware/upload'); 

/// ==========================================
// 1. PUBLIC API (PAKAI API KEY)
// ==========================================
router.get('/external/all', apiGuard, productController.getAllProducts);
router.get('/external/:id', apiGuard, productController.getProductById);

// ==========================================
// 2. DASHBOARD (PAKAI JWT)
// ==========================================
// Ambil semua produk untuk tabel di dashboard
router.get('/', authenticateToken, productController.getAllProducts);
router.get('/:id', authenticateToken, productController.getProductById);

// ==========================================
// 3. OPERASI ADMIN (CRUD + UPLOAD)
// ==========================================

// Tambahkan 'upload.single('gambar')' di sini supaya bisa terima file
router.post('/', authenticateToken, isAdmin, upload.single('gambar'), productController.createProduct);

// Tambahkan 'upload.single('gambar')' di sini juga untuk update
router.put('/:id',  authenticateToken, isAdmin, upload.single('gambar'), productController.updateProduct);

router.delete('/:id', authenticateToken, isAdmin, productController.deleteProduct);

module.exports = router;