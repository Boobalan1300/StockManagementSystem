


const express = require('express');
const router = express.Router();

const StaffUser = require('../Models/Staff');
const generateToken = require('./generateToken');





router.post('/login/supervisor', async (req, res) => {
    const { email, password } = req.body;
    try {
        const supervisorUser = await StaffUser.findOne({ email });
        if (!supervisorUser) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

   
        if (password !== supervisorUser.password) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const tokenPayload = {
            id: supervisorUser._id,
            email: supervisorUser.email,
            role: 'supervisor'
        };
        const token = generateToken(tokenPayload);
        res.json({ token });
    } catch (error) {
        console.error('Error logging in supervisor:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



  router.get('/supervisor/:email', async (req, res) => {
    const { email } = req.params;

    try {
       
        const supervisorUser = await StaffUser.findOne({ email });

        if (!supervisorUser) {
            return res.status(404).json({ message: 'Supervisor user not found' });
        }

       
        res.json({ adminId: supervisorUser.adminId });
    } catch (error) {
        console.error('Error fetching supervisor data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


//NumberOfStaffs

router.get('/staff/:adminId', async (req, res) => {
    try {
        const { adminId } = req.params;
        const staff = await StaffUser.find({ adminId }); 
        res.json(staff);
    } catch (error) {
        console.error('Error fetching staff data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.delete("/delete/:email", async (req, res) => {
    try {
      const { email } = req.params;
    
      const deletedStaff = await StaffUser.findOneAndDelete({ email });
      console.log("Deleted staff member:", deletedStaff.email);
      res.status(200).json({ message: "Staff member deleted successfully" });
    } catch (error) {
      console.error("Error deleting staff member:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });


  //STaffStore

  router.post('/staff', async (req, res) => {
    try {
  
      const { name, email, password, staffId, adminId, contact } = req.body;
  
  
      const staffUser = new StaffUser({
        name,
        email,
        password,
        staffId,
        adminId,
        contact
      });
  
  
      await staffUser.save();
  
      res.status(201).json({ message: 'Staff user created successfully', staffUser });
    } catch (error) {
      console.error('Error creating staff user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });



//update staff details


  router.put('/update/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const updatedData = req.body;

        const updatedStaff = await StaffUser.findOneAndUpdate({ email }, updatedData, { new: true });

        if (!updatedStaff) {
            return res.status(404).json({ error: 'Staff member not found' });
        }

        console.log('Updated staff member:', updatedStaff);
        res.status(200).json(updatedStaff);
    } catch (error) {
        console.error('Error updating staff member:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;
