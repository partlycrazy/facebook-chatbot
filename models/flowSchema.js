const mongoose = require('mongoose');

const flowSchema = mongoose.Schema({
    name: {
        type: String
    },
    keywords: {
        type: [String]
    },
    type: {
        type: String
    },
    content: {
        type: Object
    }
});

const messageFlow = module.exports = mongoose.model("messageFlow", flowSchema);