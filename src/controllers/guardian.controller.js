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

module.exports = { getUniqueId };
