const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    favoritesProducts: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            createdAt: { type: Date, default: Date.now }
        }],
    adress: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        zipCode: { type: String },
        country: { type: String },
        createdAt: { type: Date, default: Date.now },
    },
    admin: { type: Boolean, default: false , required: true }
});

UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

UserSchema.pre('findOneAndUpdate', async function (next) {
    this._update.updatedAt = new Date();
    if (this._update.password) {
        this._update.password = await bcrypt.hash(this._update.password, 10);
    }
    next();
});

module.exports = mongoose.model('User', UserSchema);
