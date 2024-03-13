






const express = require('express');
const router = express.Router();
const Request = require('../Models/Request');
const Company = require('../Models/Company');
const Product = require("../Models/Product")

router.get('/requests/:adminId', async (req, res) => {
    const adminId = req.params.adminId;

    try {
      
        const requests = await Request.find({  });

     
        res.json({ requests });
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/companies', async (req, res) => {
    try {
      const companies = await Company.find();
      res.json(companies);
    } catch (err) {
      console.error('Error fetching companies:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });





router.put('/update-order-taken/:requestCode', async (req, res) => {
  try {
    const { requestCode } = req.params;
    const { orderTakenDate } = req.body;

    await Company.findOneAndUpdate({ RequestCode: requestCode }, { orderTaken: true, orderTakenDate });
    await Request.findOneAndUpdate({ RequestCode: requestCode }, { orderTaken: true, orderTakenDate });

    res.json({ message: 'Order taken status updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});




router.put('/update-order-send/:requestCode', async (req, res) => {
  try {
    const { requestCode } = req.params;
    const { orderSendDate } = req.body;

    await Company.findOneAndUpdate({ RequestCode: requestCode }, { orderSend: true, orderSendDate });
    await Request.findOneAndUpdate({ RequestCode: requestCode }, { orderSend: true, orderSendDate });

    res.json({ message: 'Order send status updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});


router.put('/update-reached-branch/:requestCode', async (req, res) => {
  try {
    const { requestCode } = req.params;
    const { reachedNearBranchDate } = req.body;

    await Company.findOneAndUpdate({ RequestCode: requestCode }, { reachedNearBranch: true, reachedNearBranchDate });
    await Request.findOneAndUpdate({ RequestCode: requestCode }, { reachedNearBranch: true, reachedNearBranchDate });

    res.json({ message: 'Reached near branch status updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});


router.put('/update-delivered/:requestCode', async (req, res) => {
  try {
    const { requestCode } = req.params;
    const { deliveredDate } = req.body;

   
    await Company.findOneAndUpdate({ RequestCode: requestCode }, { delivered: true, deliveredDate });
    await Request.findOneAndUpdate({ RequestCode: requestCode }, { delivered: true, deliveredDate });

   
    const { requestedQuantity, productCode } = await Company.findOne({ RequestCode: requestCode });

    
    await Product.findOneAndUpdate({ productCode }, 
      { $inc: { quantity: requestedQuantity } }
    );

    res.json({ message: 'Delivered status updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});







router.get('/order-taken-date/:requestCode', async (req, res) => {
  try {
    const { requestCode } = req.params;
    const company = await Company.findOne({ RequestCode: requestCode });
    if (company) {
      res.json({ orderTakenDate: company.orderTakenDate });
    } else {
      res.status(404).json({ error: 'Company not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});



router.get('/order-taken-date/:requestCode', async (req, res) => {
  try {
    const { requestCode } = req.params;
    const company = await Company.findOne({ RequestCode: requestCode });
    if (company) {
      res.json({ orderTakenDate: company.orderTakenDate });
    } else {
      res.status(404).json({ error: 'Company not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});


router.get('/order-send-date/:requestCode', async (req, res) => {
  try {
    const { requestCode } = req.params;
    const company = await Company.findOne({ RequestCode: requestCode });
    if (company) {
      res.json({ orderSendDate: company.orderSendDate });
    } else {
      res.status(404).json({ error: 'Company not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});


router.get('/reached-branch-date/:requestCode', async (req, res) => {
  try {
    const { requestCode } = req.params;
    const company = await Company.findOne({ RequestCode: requestCode });
    if (company) {
      res.json({ reachedNearBranchDate: company.reachedNearBranchDate });
    } else {
      res.status(404).json({ error: 'Company not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});


router.get('/delivered-date/:requestCode', async (req, res) => {
  try {
    const { requestCode } = req.params;
    const company = await Company.findOne({ RequestCode: requestCode });
    if (company) {
      res.json({ deliveredDate: company.deliveredDate });
    } else {
      res.status(404).json({ error: 'Company not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});


module.exports = router;
