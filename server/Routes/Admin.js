const express = require('express');
const router = express.Router();
const AdminUser = require('../Models/User');
// const StaffUser = require('../Models/Staff');
const generateToken = require('./generateToken');
const bcrypt = require('bcrypt');



//SignUP

router.post('/adminSignup', async (req, res) => {
    try {
      const { email, password, adminId } = req.body;
  
     
      if (!email || !password || !adminId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      const existingAdminUser = await AdminUser.findOne({ email });
      if (existingAdminUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }
  
  
      const existingAdminId = await AdminUser.findOne({ adminId });
      if (existingAdminId) {
        return res.status(400).json({ error: 'AdminId already exists' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
  
      const adminUser = new AdminUser({ email, password: hashedPassword, adminId });
  
  
      await adminUser.save();
  
      console.log('Admin user signed up successfully:', adminUser);
      return res.status(201).send('Admin user signed up successfully');
    } catch (error) {
      console.error('Error signing up admin user:', error);
      return res.status(500).send('Error signing up admin user');
    }
  });

  //Login

router.post('/login/admin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const adminUser = await AdminUser.findOne({ email });
        if (!adminUser) {
            return res.status(401).json({ error: 'No user is found' });
        }

        const validPassword = await bcrypt.compare(password, adminUser.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const tokenPayload = {
            id: adminUser._id,
            email: adminUser.email,
            role: 'admin'
        };
        const token = generateToken(tokenPayload);
        res.json({ token });
    } catch (error) {
        console.error('Error logging in admin:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



router.get('/adminId/:email', async (req, res) => {
    const { email } = req.params;
  
    try {
     
      const adminUser = await AdminUser.findOne({ email });
  
      if (!adminUser) {
        return res.status(404).json({ message: 'Admin user not found' });
      }
  
    
      res.json({ adminId: adminUser.adminId });
    } catch (error) {
      console.error('Error fetching adminId:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });





module.exports = router;
