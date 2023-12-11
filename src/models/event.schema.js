const mongoose = require('mongoose');

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

const Event = mongoose.model('event', eventSchema);

module.exports = Event;
