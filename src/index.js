const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const fs = require('fs');
const dotenv = require('dotenv').config();
const db = require('./configs/connection');
var cron = require('node-cron');

// Importing Routes
const authRoutes = require('./routers/auth.route');
const guardianRoutes = require('./routers/guardian.route');
const patientRoutes = require('./routers/patient.route');
const medicineRoutes = require('./routers/medicine.route');

// Initializing an express app
const app = express();

// Server Port
const PORT = process.env.PORT;

// Formatting incoming data and allowing cross origin requests
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging incoming requests
app.use(morgan('dev'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/guardian', guardianRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/medicine', medicineRoutes);

// Keep deployed url active
cron.schedule('*/10 * * * *', () => {
    console.log('Cron job running every 10 minutes');
});

// Test API
app.get('/api', (req, res) => {
    res.status(200).json({
        name: `${process.env.APP_NAME}`,
        apiVersion: JSON.parse(fs.readFileSync('./package.json').toString())
            .version
    });
});

// Listening on the port
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
