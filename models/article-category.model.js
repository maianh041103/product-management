const mongoose = require('mongoose');
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const articleCategory = new mongoose.Schema({
  title: String,
  parent_id: {
    type: String,
    default: ""
  },
  description: String,
  thumbnail: String,
  status: String,
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
  deleted: {
    type: Boolean,
    default: false
  },
  deletedBy: {
    account_id: String,
    deletedAt: Date
  },
  updatedBy: [
    {
      account_id: String,
      updatedAt: Date
    }]
})
const ArticleCategory = mongoose.model("ArticleCategory", articleCategory, "ArticleCategory");
module.exports = ArticleCategory;