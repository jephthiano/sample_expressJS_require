const setInputData = (req, res, next) => {
    try {
        req.data = { input: req.body };
        next();
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Error processing request data',
            error: error.message,
        });
    }
};

module.exports = { setInputData };
