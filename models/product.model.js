const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const productSchema = new mongoose.Schema(
    {
        title: String,
        productCategory: {
            type: String,
            default: ""
        },
        description: String,
        price: Number,
        discountPercentage: Number,
        stock: Number,
        thumbnail: String,
        status: String,
        position: Number,
        deleted: {
            type: Boolean,
            default: false
        },
        slug: {
            type: String,
            slug: "title",
            unique: true
        },
        createdBy: {
            account_id: String,
            createdAt: {
                type: Date,
                default: new Date()
            }
        },
        deletedBy: {
            account_id: String,
            deleteAt: Date
        }
    },
    {
        timestamps: true
    })

const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;