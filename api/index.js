const mongoose = require('mongoose');
const express = require('express');
const User = require('./Models/User');
const Post = require('./Models/Post');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express();
const secret = 'alksdjfklasjdfklksdjhfius'
app.use('/Uploads', express.static(__dirname+'/Uploads'));
app.use(cors({credentials:true,origin:'http://localhost:3001'}));
app.use(express.json());
app.use(cookieParser());
app.use('/Uploads', express.static(__dirname+'/Uploads'));
const multer = require('multer');
const uploadMiddleware = multer({dest:'Uploads/'});
const fs = require('fs');


mongoose.connect('mongodb://localhost:27017/Blog', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.log('Database connection failed', err));

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const userdoc = await User.create({ username, password: hashedPassword });
    res.send({ userdoc });
  } catch (e) {
    res.status(400).send('An error occurred while creating the user');
  }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const userdoc = await User.findOne({ username });

    if (!userdoc) {
      return res.status(401).json({ message: 'Wrong credentials' });}
    const passok = bcrypt.compareSync(password, userdoc.password);
    if (!passok) {
      return res.status(401).json({ message: 'Wrong credentials' });}
    jwt.sign({ username, id: userdoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie('token', token).json('ok');
    });
  });

  app.get('/profile', (req,res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err,info) => {
      if (err) throw err;
      res.json(info);
    });
  });
  

app.post('/post', uploadMiddleware.single('file'), async (req,res) => {
    const {originalname,path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path+'.'+ext;
    fs.renameSync(path, newPath);
  
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err,info) => {
      if (err) throw err;
      const {title,summary,content} = req.body;
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover:newPath,
        author:info.id,
      });
      res.json(postDoc);
    });
  
  });

app.post('/logout', (req,res)=>{
    res.cookie('token','').json('ok');
})

app.get('/post', async (req,res) => {
    res.json(
      await Post.find()
        .populate('author', ['username'])
        .sort({createdAt: -1})
        .limit(20)
    );
  });

  app.get('/post/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', ['username']);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching post' });
    }
});
app.put('/post',uploadMiddleware.single('file'), async (req,res) => {
  let newPath = null;
  if (req.file) {
    const {originalname,path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    newPath = path+'.'+ext;
    fs.renameSync(path, newPath);
  }

  const {token} = req.cookies;
  jwt.verify(token, secret, {}, async (err,info) => {
    if (err) throw err;
    const {id,title,summary,content} = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json('you are not the author');
    }
    await postDoc.set({
      title,
      summary,
      content,
      cover: newPath ? newPath : postDoc.cover,
    });
    await postDoc.save();
    

    res.json(postDoc);
  });

});

app.post('/post/:id/like', async (req, res) => {
  const {token} = req.cookies;
  jwt.verify(token, secret, {}, async (err,info) => {
    if (err) throw err;
    const post = await Post.findById(req.params.id);
    if (post.usersLiked.includes(info.id)) {
      post.likes -= 1;
      post.usersLiked = post.usersLiked.filter(userId => userId.toString() !== info.id.toString());
    } else {
      post.likes += 1;
      post.usersLiked.push(info.id);
    }
    await post.save();
    const updatedPost = await Post.findById(req.params.id).populate('author', ['username']); // Fetch the updated post
    res.status(200).json(updatedPost); // Send back the updated post
  });
});

app.post('/post/:id/dislike', async (req, res) => {
  const {token} = req.cookies;
  jwt.verify(token, secret, {}, async (err,info) => {
    if (err) throw err;
    const post = await Post.findById(req.params.id);
    if (post.usersDisliked.includes(info.id)) {
      post.dislikes -= 1;
      post.usersDisliked = post.usersDisliked.filter(userId => userId.toString() !== info.id.toString());
    } else {
      post.dislikes += 1;
      post.usersDisliked.push(info.id);
    }
    await post.save();
    const updatedPost = await Post.findById(req.params.id).populate('author', ['username']); // Fetch the updated post
    res.status(200).json(updatedPost); // Send back the updated post
  });
});

app.listen(9000, () => console.log('Server is running on port 9000'));
