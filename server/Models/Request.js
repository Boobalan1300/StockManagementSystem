


const mongoose = require('mongoose');
const shortid = require('shortid');

const requestSchema = new mongoose.Schema({
    RequestCode: { type: String, default: shortid.generate }, 
    image: String,
    productId: String,
    productName: String,
    cost: Number,
    category: { type: String, default: null },
    subcategory: { type: String, default: null },
    description: { type: String, default: null },
    brandName: { type: String, default: null },
    date: { type: Date, default: null },
    productStatus: { type: String, default: 'Null' },
    update: { type: Boolean, default: false },
    productCode: String,
    color: { type: String, default: "none" },
    size: { type: String, default: "none" },
    quantity: { type: Number, default: null },
    minQuantity: { type: Number, default: 9 },
    maxQuantity: { type: Number, default: 19 },
    requested: { type: Boolean, default: false },
    requestedQuantity: { type: Number, default: null },
    requestedEmail: { type: String, default: "none" },
    placeOrder: { type: Boolean, default: false },
    orderTaken: { type: Boolean, default: false },
    orderTakenDate: { type: Date, default: null },
    orderSend: { type: Boolean, default: false },
    orderSendDate: { type: Date, default: null },
    reachedNearBranch: { type: Boolean, default: false },
    reachedNearBranchDate: { type: Date, default: null }, 
    delivered: { type: Boolean, default: false },
    deliveredDate: { type: Date, default: null }, 
    completed: { type: Boolean, default: false },
});

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
