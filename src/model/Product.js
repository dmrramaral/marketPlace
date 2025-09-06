const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: [{ 
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
        name: { type: String },
        createdAt: { type: Date, default: Date.now }
     }],
    brand: { type: String },
    sizes: [{ type: String }],
    colors: [{ type: String }],
    stock: { type: Number, required: true },
    images: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    ratings: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    
    reviews: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            comment: { type: String },
            rating: { type: Number },
            createdAt: { type: Date, default: Date.now }
        }
    ]
}); 
module.exports = mongoose.model('Product', ProductSchema);