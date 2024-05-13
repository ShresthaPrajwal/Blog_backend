const mongoose = require('mongoose');

// const imageSchema = new mongoose.Schema({
//   imageName: {
//     type: String,
//     required: true,
//   },
//   paths: [
//     {
//       size: {
//         type: String,
//         required: true,
//         enum: ['large', 'medium', 'small', 'extrasmall'],
//       },
//       width: {
//         type: Number,
//         required: true,
//       },
//       path: {
//         type: String,
//         required: true,
//       },
//     },
//   ],
// });

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  slug: { type: String, required: true },
  featuredImage: { type: mongoose.Schema.Types.ObjectId, ref: 'Media' },
  media: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Media',
    },
  ],
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
