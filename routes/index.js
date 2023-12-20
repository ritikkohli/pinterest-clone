const express = require('express');
const router = express.Router();
const userModel = require('./users');
const localStrategy = require('passport-local');
const passport = require('passport');
passport.use(new localStrategy(userModel.authenticate()));

router.get('/',function(req,res){
  res.render('index')
})

router.get('/feed', isLoggedIn,async function(req,res){
  res.render('feed')
} )

router.get('/profile', isLoggedIn,async function(req, res){
  res.render('profile')
})

router.get('/login',async function(req,res){
  res.render('login')
})

router.get('/signup', function(req, res) {
  res.render('register', { title: 'Express' });
});

router.post('/register',async function(req,res){
  const { username, fullname, email } = req.body;
  const userData = new userModel({ username, fullname, email });

  userModel.register(userData, req.body.password)
  .then(function(registeredUser){
    passport.authenticate("local")(req,res,function(){
      res.redirect('/feed');
    })
  })
})

router.post('/login', passport.authenticate('local',{
  successRedirect : '/feed',
  failureRedirect : '/'
}), function(req,res){

})

router.get('/logout', function(req,res){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}

module.exports = router;