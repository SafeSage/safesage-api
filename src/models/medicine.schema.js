const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    tube: {
        type: String
    },
    drugName: {
        type: String,
        required: true
    },
    brandName: {
        type: String
    },
    form: {
        type: String,
        enum: ['tablet', 'syrup', 'chewable', 'capsule'],
        required: true
    },
    dosageStrength: {
        type: String
    },
    days: {
        type: [String]
    },
    times: {
        type: [String]
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    timestamps: {
        type: [Date],
        default: []
    },
    pillsLoaded: {
        type: Number,
        default: 0
    },
    pillsLeft: {
        type: Number,
        default: 0
    },
    instructions: {
        type: String
    },
    sideEffects: {
        type: String
    },
    medicineDispenser: {
        type: Boolean,
        default: false
    },
    inventoryManagement: {
        type: Boolean,
        default: true
    },
    pillsInStrip: {
        type: Number
    },
    noOfStrips: {
        type: Number
    },
    totalPills: {
        type: Number,
        default: 0
    },
    dailyFrequency: {
        type: Number
    },
    stockReminder: {
        daysLeft: {
            type: Number
        },
        reminderDate: {
            type: Date
        },
        endDate: {
            type: Date
        }
    },
    guardianId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('Medicine', medicineSchema);