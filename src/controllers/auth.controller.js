const Auth = require('./../models/auth.schema');
const User = require('./../models/user.schema');
const {
    generateOtp,
    hashPassword,
    validatePassword,
    generateBearerToken,
    removeSensitiveData
} = require('./../utilities/utils');
const dotenv = require('dotenv').config();

const signUp = async (req, res) => {
    try {
        const hashedPassword = hashPassword(req.body.password);
        const uniqueID = undefined;
        if (req.body.userType == 'GUARDIAN') {
            const uniqueID = generateOtp(6);
        }

        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            userType: req.body.userType,
            phone: req.body.phone,
            address: req.body.address ? address : undefined,
            uniqueId: uniqueID,
            emergencyContacts: req.body.emergencyContacts
                ? req.body.emergencyContacts
                : undefined,
            height: req.body.height ? req.body.height : undefined,
            weight: req.body.weight ? req.body.weight : undefined,
            bmi: req.body.bmi ? req.body.bmi : undefined
        });

        await newUser.save();

        // const auth = await sendEmailOtp(req, newUser);

        const { token, expireDate } = await generateBearerToken(newUser);

        res.status(201).json({
            message: 'User registered',
            data: {
                user: newUser,
                token,
                expireDate
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
        const user = await User.findOne({
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
                let user1 = removeSensitiveData(user);
                res.status(200).json({
                    data: {
                        user1,
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

module.exports = {
    login,
    signUp
};
