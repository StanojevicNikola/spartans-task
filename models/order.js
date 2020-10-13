const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['served', 'processing', 'in_queue', 'canceled', 'rejected'],
        default: 'in_queue'
    },
    size: {
        type: String,
        enum: ['small', 'medium', 'large']
    },
    price: {
        type: Number
    },
    totalDuration: {
        type: Number
    },
    timeLeft: {
        type: Number,
    },
    orderNumber: {
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('Order', orderSchema);