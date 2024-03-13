
const express = require('express');
const multer = require('multer');
const shortid = require('shortid'); 
const router = express.Router();
const Product = require('../Models/Product');
const Request =require('../Models/Request');
const Company =require('../Models/Company');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const mongoose = require('mongoose');




router.post('/products', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const productCode = shortid.generate();   
        const { 
            productId,
            productName,
            cost,
            category,
            subcategory,
            description,
            brandName,
            date,
            productStatus,
            update,
            color,
            size,
            quantity,
            minQuantity,
            maxQuantity,
            orderTaken,
            orderSend,
            reachedNearBranch,
            delivered,
            completed,
            requested,
            placeOrder
        } = req.body;
       
        const image = req.file.buffer.toString('base64');

        const newProduct = new Product({
            image,
            productId,
            productName,
            cost,
            category,
            subcategory,
            description,
            brandName,
            date,
            productStatus,
            update,
            productCode,
            color,
            size,
            quantity,
            minQuantity,
            maxQuantity,
            orderTaken,
            orderSend,
            reachedNearBranch,
            delivered,
            completed,
            requested,
            placeOrder
        });
        await newProduct.save();
        
        res.status(201).json({ message: 'Product added successfully', product: newProduct });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// ProductsInStaffPage


router.delete('/products/:productCode', async (req, res) => {
    const { productCode } = req.params;

    try {
       
        await Product.findOneAndDelete({ productCode });

     
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
       
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/productsToBeUpdated/:adminId', async (req, res) => {
    const { adminId } = req.params;

    try {
        const count = await Product.countDocuments({ productId: adminId, update: false });
        res.json({ count });
    } catch (error) {
        console.error('Error fetching count of products to be updated:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/products/:adminId', async (req, res) => {
    const { adminId } = req.params;

    try {
        const products = await Product.find({  productId: adminId });
        res.json(products);
    } catch (error) {
        console.error('Error fetching product list:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/productDetails/:productId', async (req, res) => {
    const { productId } = req.params;

    try {
        const product = await Product.findOne({ productId });
       
        if (product) {
            const { image, productName, cost } = product;
            res.json({ productId, image, productName, cost });
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        console.error('Error fetching product details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Search



router.get('/searchProducts/:adminId', async (req, res) => {
    const { adminId } = req.params;

    try {
        const products = await Product.find({ productId: adminId })
        res.json(products);
    } catch (error) {
        console.error('Error fetching product list for search:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/searchProductsByCategory/:adminId/:category', async (req, res) => {
    const { adminId, category } = req.params;

    try {
        const products = await Product.find({ productId: adminId, category }).select('image productName cost category subcategory');
        res.json(products);
    } catch (error) {
        console.error('Error fetching product list for search by category:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/searchProductsByCategory/:adminId/:category/:subcategory', async (req, res) => {
  const { adminId, category, subcategory } = req.params;

  try {
      const products = await Product.find({ productId: adminId, category, subcategory }).select('image productName cost category subcategory');
      res.json(products);
  } catch (error) {
      console.error('Error fetching product list for search by category and subcategory:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});


//UpdateProducts

router.put('/updateProduct/:productCode', async (req, res) => {
    const { productCode } = req.params;
    const updatedProductData = req.body;
    
    try {
        if (req.body.image) {
            const base64Image = req.body.image.toString('base64');
            updatedProductData.image = base64Image;
        }
  
        const updatedProduct = await Product.findOneAndUpdate({ productCode }, updatedProductData, { new: true });
  
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
  
        res.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Brands

router.get('/brands/:adminId', async (req, res) => {
    const { adminId } = req.params;
  
    try {
        const brandCountAggregate = await Product.aggregate([
            { 
              $match: { 
                productId: adminId, 
                brandName: { $ne: null } 
              } 
            },
            {
              $group: {
                _id: { $toLower: "$brandName" },
                count: { $sum: 1 }
              }
            },
            {
              $project: {
                _id: 0,
                brandName: "$_id",
                count: 1
              }
            }
          ]);
      
          const brandCount = brandCountAggregate.length;
          res.json({ brandCount, brands: brandCountAggregate });
    } catch (error) {
        console.error("Error fetching distinct brand count:", error);
        res.status(500).json({ error: "Error fetching distinct brand count" });
    }
});
  
router.get('/distinctBrands/:adminId', async (req, res) => {
    const { adminId } = req.params;
  
    try {
        const distinctBrands = await Product.distinct("brandName", {
            productId: adminId,
            brandName: { $ne: null }
        });
  
        res.json({ distinctBrands });
    } catch (error) {
        console.error("Error fetching distinct brands:", error);
        res.status(500).json({ error: "Error fetching distinct brands" });
    }
});


//Stock





router.get('/outOfStock/:adminId', async (req, res) => {
    const { adminId } = req.params;

    try {
        const outOfStockPipeline = [
            { 
                $match: { 
                    productId: adminId, 
                    quantity: 0 
                } 
            },
            { 
                $project: { 
                    image: 1, 
                    productName: 1, 
                    productCode: 1, 
                    quantity: 1, 
                    category: 1, 
                    subcategory: 1 
                } 
            }
        ];

        const outOfStockList = await Product.aggregate(outOfStockPipeline);
        const outOfStockCount = await Product.countDocuments({ productId: adminId, quantity: 0 });

        res.json({ outOfStockCount, outOfStockList });
    } catch (error) {
        console.error('Error fetching out of stock products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/lessNumberOfStock/:adminId', async (req, res) => {
    const { adminId } = req.params;

    try {
        const lessNumberOfStockPipeline = [
            { 
                $match: { 
                    productId: adminId, 
                    quantity: { $gte: 1, $lte: 9 } 
                } 
            },
            { 
                $project: { 
                    image: 1, 
                    productName: 1, 
                    productCode: 1, 
                    quantity: 1, 
                    category: 1, 
                    subcategory: 1 
                } 
            }
        ];

        const lessNumberOfStockList = await Product.aggregate(lessNumberOfStockPipeline);
        const lessNumberOfStockCount = await Product.countDocuments({ productId: adminId, quantity: { $gte: 1, $lte: 9 } });

        res.json({ lessNumberOfStockCount, lessNumberOfStockList });
    } catch (error) {
        console.error('Error fetching less number of stock products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/overStock/:adminId', async (req, res) => {
    const { adminId } = req.params;

    try {
        const overStockPipeline = [
            { 
                $match: { 
                    productId: adminId, 
                    quantity: { $gte: 20 } 
                } 
            },
            { 
                $project: { 
                    image: 1, 
                    productName: 1, 
                    productCode: 1, 
                    quantity: 1, 
                    category: 1, 
                    subcategory: 1 
                } 
            }
        ];

        const overStockList = await Product.aggregate(overStockPipeline);
        const overStockCount = await Product.countDocuments({ productId: adminId, quantity: { $gte: 20 } });

        res.json({ overStockCount, overStockList });
    } catch (error) {
        console.error('Error fetching over stock products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});




router.post('/request/:productCode', async (req, res) => {
    const { productCode } = req.params;
    const { requestedQuantity, email } = req.body;

    try {
       
        let existingRequest = await Request.findOne({ productCode, requestedEmail: email });

        if (existingRequest) {
          
            existingRequest.requestedQuantity = requestedQuantity;
            await existingRequest.save();
            return res.json({ message: 'Requested quantity updated successfully', product: existingRequest });
        }

        
        const product = await Product.findOne({ productCode });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

       
        const newRequestId = new mongoose.Types.ObjectId();

       
        const request = new Request({
            ...product.toObject(),
            _id: newRequestId,
            requestedQuantity,
            requested: true,
            requestedEmail: email
        });

    
        await request.save();

        res.json({ message: 'Product requested successfully', product: request });
    } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyValue) {
            
            console.error('Duplicate key error:', error);
            return res.status(400).json({ error: 'Duplicate key error' });
        } else {
           
            console.error('Error requesting product:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
});






router.get('/requestedQuantity/:productCode/:email', async (req, res) => {
    const { productCode, email } = req.params;
    try {
       
        const product = await Request.findOne({ productCode, requestedEmail: email });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

       
        const requestedQuantity = product.requestedQuantity || 0;
        const requested = product.requested || false; 
        res.status(200).json({ requestedQuantity, requested });
    } catch (error) {
        console.error("Error fetching requested quantity:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});




router.post('/confirm-order/:requestId', async (req, res) => {
    const { requestId } = req.params;

    try {
       
        const request = await Request.findById(requestId);

        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        request.placeOrder = true;
        await request.save();

       
        const companyData = {
            ...request.toObject(),
            requestedProduct: true
        };

       
        const newCompanyId = new mongoose.Types.ObjectId();

       
        const company = new Company({
            ...companyData,
            _id: newCompanyId
        });

        
        await company.save();

        res.json({ message: 'Order confirmed and copied to Company collection', company });
    } catch (error) {
        console.error('Error confirming order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});






module.exports = router;
