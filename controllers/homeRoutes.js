const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', (req, res) => {
    Post.findAll({
      attributes: [
        'id',
        'title',
        'content',
        'date_created'
      ],
      include: [
        {
          model: Comment,
          attributes: ['id', 'user_id', 'post_id', 'content' , 'date_created'],
          include: {
            model: User,
            attributes: ['username']
          }
        },
        {
          model: User,
          attributes: ['username']
        }
      ]
    })
      .then(dbPostData => {
        const posts = dbPostData.map(post => post.get({ plain: true }));
        res.render('homepage', {
            posts,
            loggedIn: req.session.loggedIn
          });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

router.get('/login', (req, res) => {
    res.render('login');
  });

  router.get('/signup', (req, res) => {
    res.render('signup');
  });

  router.get('/dashboard', (req, res) => {
    if (!req.session.loggedIn) {
      res.redirect('/');
      return;
    }
    res.render('dashboard');
  });

  router.get('/post/:id', (req, res) => {
    Post.findOne({
      where: {
        id: req.params.id
      },
      attributes: [
        'id',
        'title',
        'content',
        'date_created'
      ],
      include: [
        {
          model: Comment,
          attributes: ['id', 'user_id', 'post_id', 'content' , 'date_created'],
          include: {
            model: User,
            attributes: ['username']
          }
        },
        {
          model: User,
          attributes: ['username']
        }
      ]
    })
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
  
        // serialize the data
        const post = dbPostData.get({ plain: true });
        // pass data to template
        res.render('single-post', {
            post,
            loggedIn: req.session.loggedIn,
            user_id: req.session.user_id
          });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

module.exports = router;