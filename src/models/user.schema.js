// Importing modules
const mongoose = require('mongoose');

// Creating the schema
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true
        },
        address: {
            type: String,
            trim: true
        },
        password: {
            type: String,
            required: true,
            trim: true
        },
        userType: {
            type: String,
            enum: ['GUARDIAN', 'PATIENT'],
            required: true
        },
        // GUARDIAN FIELDS
        uniqueId: {
            type: String
        },
        patientIds: {
            type: [String]
        },
        // PATIENT FIELDS
        emergencyContacts: {
            type: [String]
        },
        height: {
            type: String
        },
        weight: {
            type: String
        },
        bmi: {
            type: String
        },
        guardianIds: {
            type: [String]
        }
    },
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);

// Exporting the module
module.exports = User;
