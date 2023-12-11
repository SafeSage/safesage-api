const Event = require('./../models/event.schema');
const User = require('./../models/user.schema');
const { removeSensitiveData, cloudinary } = require('../utilities/utils');
const axios = require('axios');
const dotenv = require('dotenv').config();
const fs = require('fs');

const connectToGuardian = async (req, res) => {
    try {
        let user = await User.findById(req.user.id);
        if (!user) {
            res.status(404).json({
                message: 'User not found'
            });
        } else {
            let guardian = await User.find({ uniqueId: req.body.uniqueId });
            if (!guardian) {
                res.status(404).json({
                    message: 'Guardian not found'
                });
            } else {
                user.guardianIds.push(guardian[0]._id);

                await user.save();
                user = removeSensitiveData(user);
                guardian = removeSensitiveData(guardian);
                res.status(200).json({
                    message: 'Connected to Guardian',
                    data: {
                        user,
                        guardian: guardian
                    }
                });
            }
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const detectFall = async (req, res) => {
    try {
        if (req.file) {
            const image = fs.readFileSync(req.file.path, {
                encoding: 'base64'
            });
            const fallDetectionResponse = await axios({
                method: 'POST',
                url: 'https://detect.roboflow.com/fall_detection-shgkx/3',
                params: {
                    api_key: process.env.FD_API_KEY
                },
                data: image,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            if (fallDetectionResponse.data.predictions[0].class_id == 0) {
                const guardian = await User.find({
                    uniqueId: req.body.uniqueId
                });
                const patient = await User.find({
                    guardianIds: guardian[0]._id
                });
                const patientId = patient[0]._id;

                const fileUrl = await cloudinary.uploader.upload(
                    req.file.path,
                    {
                        resource_type: 'raw',
                        public_id: `safesage/fall-detection/${patientId}/${req.file.filename}`
                    }
                );

                const event = new Event({
                    guardianId: guardian[0]._id,
                    patientId: patient[0]._id,
                    title: 'Fall detected!',
                    description: `Patient ${patient[0].name} has fallen. Please check ASAP!!`,
                    url: fileUrl.url
                });
                await event.save();

                await axios.post(
                    `https://ntfy.sh/${guardian[0].phone}`,
                    `Patient ${patient[0].name} has fallen. Please check ASAP!!`,
                    {
                        headers: {
                            Icon: fileUrl.url,
                            Title: 'Fall detected!',
                            Tags: 'cold_sweat'
                        }
                    }
                );
            }
            fs.unlinkSync(req.file.path);
            res.status(200).json({
                message: fallDetectionResponse.data.predictions[0].class,
                data: {
                    output: fallDetectionResponse.data.predictions[0]
                }
            });
        } else {
            res.status(400).json({
                message: 'Image not sent'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = { connectToGuardian, detectFall };
