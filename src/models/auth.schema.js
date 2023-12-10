const mongoose = require('mongoose');

const authSchema = new mongoose.Schema(
    {
        user: {
            type: {
                name: {
                    type: String
                },
                email: {
                    type: String
                },
                phone: {
                    type: String
                },
                role: {
                    type: String,
                    enum: ['GUARDIAN', 'PATIENT']
                }
            }
        },
        token: {
            type: String
        },
        tokenType: {
            type: String,
            enum: ['BEARER']
        },
        isExpired: {
            type: Boolean,
            default: false
        },
        expireAt: {
            type: Date
        },
        lastAccess: {
            type: Date
        }
    },
    { timestamps: true }
);

const Auth = mongoose.model('auth', authSchema);

module.exports = Auth;
