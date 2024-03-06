const mongoose = require('mongoose');
const {Schema,model} = mongoose;

const PostSchema = new Schema({
  title: String,
  summary: String,
  content: String,
  cover: String,
  author: { type: Schema.Types.ObjectId, ref: 'Users' },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  usersLiked: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
  usersDisliked: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
}, {
  timestamps: true,
});

const PostModel = model('Post', PostSchema);

module.exports = PostModel;
