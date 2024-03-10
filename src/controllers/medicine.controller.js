const axios = require('axios');
const dotenv = require('dotenv').config();
const moment = require('moment');

const Medicine = require('../models/medicine.schema');
const User = require('../models/user.schema');

const addMedicine = async (req, res) => {
    try {
        const user = User.findById(req.user.id);
        const { dailyFrequency, noOfStrips, pillsInStrip, days } = req.body;
        const {daysLeft} = req.body.stockReminder;
        const totalPills = noOfStrips * pillsInStrip;
        const today = moment().startOf('day');

        let daysToAdd = 0;
        let pillsRemaining = totalPills;

        for (let i = 0; i < 30; i++) {
            const currentDay = today.clone().add(i, 'days').format('ddd');
            if (days.includes(currentDay)) {
                pillsRemaining -= dailyFrequency;
                daysToAdd = i;
                if (pillsRemaining <= 0) {
                    break;
                }
            }
        }

        const endDate = today.clone().add(daysToAdd, 'days');
        const endDateFormatted = endDate.toISOString();
        const reminderDate = endDate.subtract(daysLeft, 'days').toISOString();
        const medicine = new Medicine({
            ...req.body,
            stockReminder: {
                daysLeft,
                reminderDate,
                endDate: endDateFormatted
            },
            guardianId: user.userType == 'GUARDIAN' ? user.id : undefined,
        });
        await medicine.save();

        res.status(201).json({
            message: 'Medicine added',
            data: {
                medicine
            }
        });

    } catch (error) {
        console.error('Error updating stock reminder:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const updateMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id);
        if (!medicine) {
            res.status(404).json({
                message: 'Medicine not found'
            });
        } else {
            const { dailyFrequency, noOfStrips, pillsInStrip, days } = req.body;
            const {daysLeft} = req.body.stockReminder;
            const totalPills = noOfStrips * pillsInStrip;
            const today = moment().startOf('day');

            let daysToAdd = 0;
            let pillsRemaining = totalPills;

            for (let i = 0; i < 30; i++) {
                const currentDay = today.clone().add(i, 'days').format('ddd');
                if (days.includes(currentDay)) {
                    pillsRemaining -= dailyFrequency;
                    daysToAdd = i;
                    if (pillsRemaining <= 0) {
                        break;
                    }
                }
            }

            const endDate = today.clone().add(daysToAdd, 'days');
            const endDateFormatted = endDate.toISOString();
            const reminderDate = endDate.subtract(daysLeft, 'days').toISOString();
            const updatedMedicine = await Medicine.findByIdAndUpdate(req.params.medicineId, {
                ...req.body,
                stockReminder: {
                    daysLeft,
                    reminderDate,
                    endDate: endDateFormatted
                }
            }, { new: true });

            res.status(200).json({
                message: 'Medicine updated',
                data: {
                    updatedMedicine
                }
            });
        }
    }
    catch (error) {
        console.error('Error updating stock reminder:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.medicineId);
        if (!medicine) {
            res.status(404).json({
                message: 'Medicine not found'
            });
        } else {
            res.status(200).json({
                message: 'Medicine found',
                data: {
                    medicine
                }
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

const getAllMedicines = async (req, res) => {
    try {
        const medicines = await Medicine.find({ patientId: req.params.patientId });
        if (!medicines) {
            res.status(404).json({
                message: 'Medicines not found'
            });
        } else {
            res.status(200).json({
                message: 'Medicines found',
                data: {
                    medicines
                }
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

const deleteMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.findByIdAndDelete(req.params.medicineId);
        if (!medicine) {
            res.status(404).json({
                message: 'Medicine not found'
            });
        } else {
            res.status(200).json({
                message: 'Medicine deleted'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

module.exports = { addMedicine, updateMedicine, deleteMedicine, getMedicine, getAllMedicines};