const Auth = require('./../models/auth.schema');
const User = require('./../models/user.schema');
const {
    generateOtp,
    hashPassword,
    validatePassword,
    generateBearerToken,
    removeSensitiveData,
    sendEmailOtp
} = require('./../utilities/utils');
const dotenv = require('dotenv').config();

const signUp = async (req, res) => {
    try {
        const hashedPassword = hashPassword(req.body.password);
        let uniqueID = undefined;
        if (req.body.userType == 'GUARDIAN') {
            uniqueID = generateOtp(6);
        }

        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            userType: req.body.userType,
            phone: req.body.phone,
            address: req.body.address ? req.body.address : undefined,
            uniqueId: uniqueID,
            emergencyContacts: req.body.emergencyContacts
                ? req.body.emergencyContacts
                : undefined,
            height: req.body.height ? req.body.height : undefined,
            weight: req.body.weight ? req.body.weight : undefined,
            bmi: req.body.bmi ? req.body.bmi : undefined,
            guardianIds: []
        });

        await newUser.save();

        const auth = await sendEmailOtp(req, newUser);

        const { token, expireDate } = await generateBearerToken(newUser);

        res.status(201).json({
            message: 'User registered',
            data: {
                user: newUser,
                token,
                expireDate,
                authEmailId: auth._id
            }
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        let user = await User.findOne({
            email: req.body.email
        });

        if (!user) {
            res.status(404).json({
                message: 'Invalid email or password'
            });
        } else {
            if (!validatePassword(req.body.password, user.password)) {
                res.status(404).json({
                    message: 'Invalid email or password'
                });
            } else {
                const { token, expireDate } = await generateBearerToken(user);
                user = removeSensitiveData(user);
                res.status(200).json({
                    data: {
                        user,
                        token,
                        expireDate
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

const verifyOtp = async (req, res) => {
    try {
        const authEmail = await Auth.findById(req.body.authEmailId);

        if (!authEmail) {
            res.status(404).json({
                message: 'Email OTP not found'
            });
        } else {
            let user = await User.findOne({
                _id: authEmail.user.id
            });

            if (!user) {
                res.status(404).json({
                    message: 'User not found'
                });
            } else {
                if (authEmail.token !== req.body.emailOtp) {
                    res.status(400).json({
                        message: 'Invalid OTP'
                    });
                } else {
                    user = await User.findByIdAndUpdate(
                        user._id,
                        { isActivated: true },
                        { new: true }
                    );

                    await Auth.findByIdAndUpdate(authEmail._id, {
                        isExpired: true
                    });

                    await Auth.findByIdAndUpdate(req.token._id, {
                        isExpired: true
                    });

                    const { token, expireDate } = await generateBearerToken(
                        user
                    );
                    user = removeSensitiveData(user);
                    res.status(200).json({
                        message: 'Email verified successfully',
                        data: {
                            user,
                            token,
                            expireDate
                        }
                    });
                }
            }
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const sendOtpEmail = async (req, res) => {
    try {
        let user = await User.findOne({ _id: req.user.id, isDeleted: false });

        if (!user) {
            res.status(404).json({
                message: 'User not found'
            });
        } else {
            const auth = await sendEmailOtp(req, user);

            await Auth.findByIdAndUpdate(req.token._id, { isExpired: true });

            const { token, expireDate } = await generateBearerToken(user);
            user = removeSensitiveData(user);
            res.status(201).json({
                message: 'OTP sent successfully!',
                data: {
                    authEmailId: auth._id,
                    user,
                    token,
                    expireDate
                }
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    login,
    signUp,
    verifyOtp,
    sendOtpEmail
};
