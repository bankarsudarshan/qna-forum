const express = require('express');
const ServerConfig = require('../config/server-config');
const apiRoutes = require('./routes');

//test
const uploadOnCloudinary = require('./utils/cloudinary');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use API routes
app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, () => {
  console.log(`Server is running on port ${ServerConfig.PORT}`);
});