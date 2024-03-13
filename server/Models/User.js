

const mongoose = require('mongoose');

const adminUserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    adminId: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        default: 'Admin'
    },
    selected: {
        type: String,
        default: null 
    },
    loginStatus: {
        type: Boolean,
        default: false 
    },
    token: {
        type: String 
    }
});

const AdminUser = mongoose.model('AdminUser', adminUserSchema);

module.exports = AdminUser;
