var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const messageSchema = new Schema({

    message: {
        type: String,
    },
    time: {
        type: Date,
        default: Date.now
    },
    isOwner: {
        type: Boolean
    }

});

const messages = mongoose.model("messages", messageSchema);
exports.messages = messages;
exports.messageSchema = messageSchema;
