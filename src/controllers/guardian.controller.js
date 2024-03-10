const Event = require('../models/event.schema');
const User = require('./../models/user.schema');

const getUniqueId = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            res.status(404).json({
                message: 'User not found'
            });
        } else {
            res.status(200).json({
                message: 'Guardian Unique ID',
                data: {
                    uniqueId: user.uniqueId
                }
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getEvents = async (req, res) => {
    try {
        const events = await Event.find({ guardianId: req.user.id });
        if (!events) {
            res.status(404).json({
                message: 'User not found'
            });
        } else {
            res.status(200).json({
                message: 'Events found',
                data: {
                    events
                }
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getAllPatients = async (req, res) => {
    try {
        const patients = await User.find({ guardianIds: req.user.id });
        if (!patients) {
            res.status(404).json({
                message: 'Patients not found'
            });
        } else {
            res.status(200).json({
                message: 'Patients found',
                data: {
                    patients
                }
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

module.exports = { getUniqueId, getEvents, getAllPatients };
