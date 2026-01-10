'use strict';
const { ApiLog, ApiKey, User, Product } = require('../models');

exports.getUserStats = async (req, res) => {
    try {
        const userId = req.user.id || req.user.ID_User; 
        const userRole = req.user.role;

        // ==========================================
        // LOGIKA UNTUK ADMIN (Melihat Seluruh Sistem)
        // ==========================================
        if (userRole === 'admin') {
            const [totalProducts, totalUsers, totalApiKeys, recentActivities] = await Promise.all([
                Product.count(),
                User.count({ where: { role: 'user' } }),
                ApiKey.count(),
                ApiLog.findAll({
                    limit: 15, // Admin dapat list lebih panjang
                    order: [['created_at', 'DESC']],
                    include: [{ 
                        model: User, 
                        as: 'user', 
                        attributes: ['nama', 'email'] // Admin bisa lihat nama pelakunya
                    }]
                })
            ]);

            return res.status(200).json({
                success: true,
                role: 'admin',
                data: {
                    totalProducts,
                    totalUsers,
                    totalApiKeys,
                    recentLogs: recentActivities // Data log dari semua user
                }
            });
        }

        // ==========================================
        // LOGIKA UNTUK USER (Hanya Milik Sendiri)
        // ==========================================
        const [totalRequests, recentLogs, apiKeyRecord] = await Promise.all([
            ApiLog.count({ where: { ID_User: userId } }),
            ApiLog.findAll({
                where: { ID_User: userId },
                limit: 10,
                order: [['ID_Log', 'DESC']]
            }),
            ApiKey.findOne({ where: { ID_User: userId } })
        ]);

        return res.status(200).json({
            success: true,
            role: 'user',
            data: {
                totalRequests: totalRequests || 0,
                apiKey: apiKeyRecord ? apiKeyRecord.Key : "Belum ada Key",
                systemStatus: apiKeyRecord && apiKeyRecord.status === 'active' ? 'ACTIVE' : 'INACTIVE',
                recentLogs: recentLogs || []
            }
        });

    } catch (error) {
        console.error('ERROR STATS:', error);
        res.status(500).json({ success: false, message: 'Gagal sinkron data statistik' });
    }
};