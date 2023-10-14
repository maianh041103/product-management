const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const ArticleSchema = new mongoose.Schema({
  title: String,
  articleCategory: {
    type: String,
    default: ""
  },
  description: String,
  content: String,
  thumbnail: String,
  status: String,
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
  },
  updatedBy: [
    {
      account_id: String,
      updatedAt: Date
    }
  ]
})

const Article = new mongoose.model("Article", ArticleSchema, "Article");

module.exports = Article;