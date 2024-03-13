// const mongoose = require('mongoose');

// // Define the schema for the Company model
// const companySchema = new mongoose.Schema({
//     RequestCode:{ type: String, default: "none" },
//     image: String,
//     productId: String,
//     productName: String,
//     category: { type: String, default: null },
//     subcategory: { type: String, default: null },
//     brandName: { type: String, default: null },
//     productCode: String,
//     color: { type: String, default: "none" },
//     size: { type: String, default: "none" },
//     requestedEmail: { type: String, default: "none" },
//     requestedQuantity: { type: Number, default: null },
//     requestedProduct:{ type: Boolean, default: false },
//     orderTaken: { type: Boolean, default: false },
//     orderSend: { type: Boolean, default: false },
//     reachedNearBranch: { type: Boolean, default: false },
//     delivered: { type: Boolean, default: false },
//     completed: { type: Boolean, default: false },
// });

// // Create the Company model
// const Company = mongoose.model('Company', companySchema);

// module.exports = Company;






const mongoose = require('mongoose');

// Define the schema for the Company model
const companySchema = new mongoose.Schema({
    RequestCode:{ type: String, default: "none" },
    image: String,
    productId: String,
    productName: String,
    category: { type: String, default: null },
    subcategory: { type: String, default: null },
    brandName: { type: String, default: null },
    productCode: String,
    color: { type: String, default: "none" },
    size: { type: String, default: "none" },
    requestedEmail: { type: String, default: "none" },
    requestedQuantity: { type: Number, default: null },
    requestedProduct:{ type: Boolean, default: false },
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

// Create the Company model
const Company = mongoose.model('Company', companySchema);

module.exports = Company;

