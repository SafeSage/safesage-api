const { removeSensitiveData } = require('../utilities/utils');
const User = require('./../models/user.schema');

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
                // user = await User.findByIdAndUpdate(
                //     user._id,
                //     { $push: { guardianIds: guardianId } },
                //     { new: true }
                // );
                user.guardianIds.push(guardian[0]._id);
                console.log(guardian);
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

module.exports = { connectToGuardian };
