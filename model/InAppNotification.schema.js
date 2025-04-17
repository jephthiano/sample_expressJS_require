const mongoose = require("mongoose");
const { Schema } = mongoose;

const InAppNotificationSchema = new Schema({
    heading: { 
        type : String,
        required : [true, 'heading is not specified'],
        trim : true 
    },
    message: { 
        type : String,
        required : [true, 'message is not specified'],
        trim : true 
    },
    status: { 
        type : String,
        enum : ['new','seen'],
        default : 'new'
    },
    reg_date: { 
        type : Date, 
        default : Date.now()
    },
    user_id: { 
        type : String,
        required : [true, 'user_id is not specified'],
        trim : true 
    },
});

const inAppNotification = mongoose.model('in_app_notification', InAppNotificationSchema);

module.exports = inAppNotification;