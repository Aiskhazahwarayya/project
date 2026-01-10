const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, ApiKey } = require('../models'); // Sesuaikan path jika perlu
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

/* =========================
   REGISTER USER / ADMIN
   (ADMIN SEHARUSNYA VIA BACKEND / SQL)
========================= */
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { nama, email, password, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email sudah terdaftar' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      nama,
      email,
      password: hashedPassword,
      role: role || 'user'
    });

    const userData = {
      ID_User: newUser.ID_User,
      nama: newUser.nama,
      email: newUser.email,
      role: newUser.role
    };

    // API KEY HANYA UNTUK USER
    if (newUser.role === 'user') {
      const apiKey = process.env.API_KEY_PREFIX + crypto.randomBytes(16).toString('hex');

      await ApiKey.create({
        ID_User: newUser.ID_User,
        Key: apiKey
      });

      userData.api_key = apiKey;
    }

    const token = jwt.sign(
      { ID_User: newUser.ID_User, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      data: { user: userData, token }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   LOGIN USER / ADMIN
========================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ success: false, message: 'Email atau password salah' });
    }

    const userData = {
      ID_User: user.ID_User,
      nama: user.nama,
      email: user.email,
      role: user.role
    };

    // USER → AMBIL API KEY TERBARU / AUTO CREATE
    if (user.role === 'user') {
      // PERBAIKAN: Menggunakan order by updatedAt DESC sesuai request
      let keyRecord = await ApiKey.findOne({
        where: { ID_User: user.ID_User },
        order: [['updatedAt', 'DESC']] 
      });

      // Jika belum ada sama sekali, buat baru
      if (!keyRecord) {
        keyRecord = await ApiKey.create({
          ID_User: user.ID_User,
          Key: process.env.API_KEY_PREFIX + crypto.randomBytes(16).toString('hex')
        });
      }

      userData.api_key = keyRecord.Key;
    }

    const token = jwt.sign(
      { ID_User: user.ID_User, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login berhasil',
      data: { user: userData, token }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   GET PROFILE
========================= */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.ID_User, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User tidak ditemukan' });
    }

    // AMBIL API KEY (JIKA ADA & ROLE USER)
    // Kita ambil yang terbaru juga untuk konsistensi
    const keyRecord =
      user.role === 'user'
        ? await ApiKey.findOne({ 
            where: { ID_User: user.ID_User },
            order: [['updatedAt', 'DESC']]
          })
        : null;

    res.json({
      success: true,
      data: {
        ID_User: user.ID_User,
        nama: user.nama,
        email: user.email,
        role: user.role,
        api_key: keyRecord ? keyRecord.Key : null
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   UPDATE PROFILE
========================= */
exports.updateProfile = async (req, res) => {
  try {
    const { nama, email } = req.body;
    const userId = req.user.ID_User;

    if (email) {
      const existing = await User.findOne({
        where: { email, ID_User: { [Op.ne]: userId } }
      });

      if (existing) {
        return res
          .status(400)
          .json({ success: false, message: 'Email sudah digunakan' });
      }
    }

    await User.update({ nama, email }, { where: { ID_User: userId } });

    res.json({ success: true, message: 'Profil berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   CHANGE PASSWORD
========================= */
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findByPk(req.user.ID_User);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User tidak ditemukan' });
    }

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      return res
        .status(401)
        .json({ success: false, message: 'Password lama salah' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await User.update(
      { password: hashed },
      { where: { ID_User: user.ID_User } }
    );

    res.json({ success: true, message: 'Password berhasil diubah' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   RESET API KEY (USER ONLY)
========================= */
exports.resetApiKey = async (req, res) => {
  try {
    const userId = req.user.ID_User; // Ambil dari token langsung lebih aman
    const user = await User.findByPk(userId);

    if (!user || user.role !== 'user') {
      return res.status(403).json({
        success: false,
        message: 'Hanya user yang bisa reset API Key'
      });
    }

    const newApiKey = process.env.API_KEY_PREFIX + crypto.randomBytes(16).toString('hex');

    // PERBAIKAN: Menggunakan Update Check dulu baru Create (sesuai request)
    // Ini memastikan kita menimpa data lama jika ada, atau buat baru jika tidak ada
    const [updated] = await ApiKey.update(
      { Key: newApiKey },
      { where: { ID_User: userId } }
    );

    // Jika record belum ada di tabel ApiKey (updated === 0), kita create
    if (updated === 0) {
      await ApiKey.create({
        ID_User: userId,
        Key: newApiKey
      });
    }

    res.json({
      success: true,
      message: 'API Key berhasil diperbarui',
      api_key: newApiKey
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   ADMIN: GET ALL USERS
========================= */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { role: 'user' },
      attributes: ['ID_User', 'email', 'nama', 'role', 'createdAt'],
      order: [['ID_User', 'DESC']]
    });

    // Ambil API Key untuk setiap user
    const usersWithKeys = await Promise.all(
      users.map(async (user) => {
        const userObj = user.toJSON();
        
        if (user.role === 'user') {
          // Ambil key terbaru juga di sini
          const keyRecord = await ApiKey.findOne({
            where: { ID_User: user.ID_User },
            order: [['updatedAt', 'DESC']]
          });
          userObj.api_key = keyRecord ? keyRecord.Key : null;
        } else {
          userObj.api_key = null;
        }
        
        return userObj;
      })
    );

    res.json({
      success: true,
      data: usersWithKeys
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data users'
    });
  }
};

/* =========================
   ADMIN: DELETE USER
========================= */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Cegah admin menghapus diri sendiri
    if (req.user.ID_User === parseInt(id)) {
      return res.status(400).json({
        success: false,
        message: 'Tidak dapat menghapus akun sendiri'
      });
    }

    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    // Cegah menghapus admin lain (Opsional, tergantung kebijakan)
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Tidak dapat menghapus user dengan role admin'
      });
    }

    // Hapus API Key jika ada
    await ApiKey.destroy({ where: { ID_User: id } });

    // Hapus user
    await user.destroy();

    res.json({
      success: true,
      message: 'User berhasil dihapus'
    });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus user'
    });
  }
};