

// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const protectedRoutes=require('./Routes/protectedRoutes')
const AdminRouter=require('./Routes/Admin')
const ProductRouter=require('./Routes/Product')
const SupervisorRouter=require('./Routes/Supervisor')
const RequestRouter=require('./Routes/request')

const app = express();
const PORT = process.env.PORT || 3001;
require('dotenv').config();



app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(bodyParser.json());


// mongoose.connect('mongodb+srv://boooeditz:boobalandb@cluster0.8f7yl8j.mongodb.net/', { family:4 })
//   .then(() => console.log('Connected to MongoDB Atlas'))
//   .catch(err => console.error('Failed to connect to MongoDB:', err));



mongoose.connect(process.env.MONGODB_URI, { family: 4 })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));




app.use('/api',AdminRouter);
app.use('/api',ProductRouter);
app.use('/api',SupervisorRouter);
app.use('/api', protectedRoutes);
app.use('/api', RequestRouter);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



