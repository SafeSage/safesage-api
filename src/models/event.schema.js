// Importing modules
const mongoose = require('mongoose');

// Creating the schema
const eventSchema = new mongoose.Schema(
    {
        guardianId: {
            type: String
        },
        patientId: {
            type: String
        },
        title: {
            type: String
        },
        description: {
            type: String
        },
        url: {
            type: String
        }
    },
    { timestamps: true }
);

const Event = mongoose.model('Event', eventSchema);

// Exporting the module
module.exports = Event;
