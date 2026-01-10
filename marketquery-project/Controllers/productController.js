const { Product } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const fs = require('fs');   // PENTING: Untuk hapus file
const path = require('path'); // PENTING: Untuk path file

/* ============================================================
   1. GET ALL PRODUCTS (Dashboard & API External)
   ============================================================ */
exports.getAllProducts = async (req, res) => {
  try {
    const { search, sortBy = 'nama_barang', order = 'ASC' } = req.query;
    let whereClause = {};

    // Fitur Pencarian
    if (search) {
      whereClause[Op.or] = [
        { nama_barang: { [Op.like]: `%${search}%` } },
        { kategori: { [Op.like]: `%${search}%` } }
      ];
    }

    // Validasi Kolom Sorting
    const validSortColumns = ['nama_barang', 'harga', 'stok', 'kategori'];
    const actualSortBy = validSortColumns.includes(sortBy) ? sortBy : 'nama_barang';

    const products = await Product.findAll({
      where: whereClause,
      order: [[actualSortBy, order]]
    });

    // MATIKAN CACHE
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');

    res.status(200).json({
      success: true,
      message: 'Berhasil mengambil produk',
      data: products
    });

  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
      error: error.message
    });
  }
};

/* ============================================================
   2. GET PRODUCT BY ID
   ============================================================ */
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id); 
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Produk tidak ditemukan' 
      });
    }

    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.status(200).json({
      success: true,
      message: 'Berhasil mengambil detail produk',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
      error: error.message
    });
  }
};

/* ============================================================
   3. CREATE PRODUCT (Admin Only)
   ============================================================ */
exports.createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { nama_barang, harga, kategori, deskripsi, stok } = req.body;
    
    // Ambil nama file dari Multer
    const gambar = req.file ? req.file.filename : null; 
    
    const product = await Product.create({ 
      nama_barang, 
      harga, 
      kategori,
      deskripsi,
      gambar,
      stok
    });

    res.status(201).json({
      success: true,
      message: 'Produk berhasil dibuat',
      data: product
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Gagal membuat produk',
      error: error.message
    });
  }
};

/* ============================================================
   4. UPDATE PRODUCT (Admin Only) - LOGIC FIX GAMBAR
   ============================================================ */
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    // Ambil field delete_image juga
    const { nama_barang, harga, kategori, deskripsi, stok, delete_image } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }

    // --- LOGIKA UPDATE GAMBAR ---
    let gambarData = product.gambar; // Default: pakai gambar lama

    // KASUS 1: Ada file baru diupload
    if (req.file) {
      // Hapus gambar lama fisik jika ada
      if (product.gambar) {
        const oldPath = path.join(__dirname, '../uploads', product.gambar);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      gambarData = req.file.filename;
    } 
    // KASUS 2: User klik hapus gambar (request delete_image = 'true')
    else if (delete_image === 'true') {
      // Hapus gambar lama fisik jika ada
      if (product.gambar) {
        const oldPath = path.join(__dirname, '../uploads', product.gambar);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      gambarData = null; // Set database jadi null
    }

    // Update DB
    await product.update({ 
      nama_barang, 
      harga, 
      kategori, 
      deskripsi, 
      gambar: gambarData, 
      stok 
    });

    res.status(200).json({
      success: true,
      message: 'Produk berhasil diupdate',
      data: product
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Gagal update produk',
      error: error.message
    });
  }
};

/* ============================================================
   5. DELETE PRODUCT (Admin Only)
   ============================================================ */
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }

    // Hapus file fisik gambar jika ada sebelum hapus data di DB
    if (product.gambar) {
      const filePath = path.join(__dirname, '../uploads', product.gambar);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await product.destroy();

    res.status(200).json({
      success: true,
      message: 'Produk berhasil dihapus'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus produk',
      error: error.message
    });
  }
};