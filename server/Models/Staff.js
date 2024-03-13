const mongoose = require('mongoose');

const staffUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    staffId: {
        type: String,
        required: true,
        unique: true
    },
    adminId: {
        type: String,
        required: true
    },
    contact: {
        type: String
    },
    role: {
        type: String,
        default: 'Staff'
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

const StaffUser = mongoose.model('StaffUser', staffUserSchema);

module.exports = StaffUser;
