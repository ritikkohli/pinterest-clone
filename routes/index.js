const express = require('express');
const router = express.Router();
const userModel = require('./users');
const postModel = require('./posts');
const localStrategy = require('passport-local');
const passport = require('passport');
const upload = require('./multer');

// ------------------HomePage ------------------

router.get('/',function(req,res){
  res.render('login',{nav:false,error: req.flash('error')})
})

// ------------------ pages --------------------

router.get('/feed',async function(req,res){
  const posts = await postModel.find().populate('user');
  res.render('feed',{nav:true,posts})
} )

router.get('/mypins', isLoggedIn,async function(req,res){
  const user = await userModel.findOne({username:req.session.passport.user}).populate('posts');
  res.render('allpins',{user});
})

router.get('/profile', isLoggedIn,async function(req, res){
  const user = await userModel.findOne({username:req.session.passport.user}).populate('posts');
  // console.log(user);
  res.render('profile',{nav:true,user:user});
})

router.get('/login',function(req,res){
  res.render('login', {error: req.flash('error')});
})

router.get('/signup', function(req, res) {
  res.render('register', { title: 'Express',nav:false});
});
// -------------- auth routes backend -----------
passport.use(new localStrategy(userModel.authenticate()));


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
  failureRedirect : '/login',
  failureFlash : true,
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

// ------------------ upload route ---------------

router.post('/upload', isLoggedIn,upload.single('file'), async function(req,res){
  if(!req.file){
    return res.status(400).send('No files were uploaded.');
  }

  // res.send('File uploaded successfully!');
  const user = await userModel.findOne({username: req.session.passport.user});
  const createdPost = await postModel.create({
    image : req.file.filename,
    postText : req.body.postname,
    user : user._id

  });
  user.posts.push(createdPost._id);
  await user.save();
  res.redirect("/profile");
});

router.post('/dpupload', isLoggedIn,upload.single('dp'), async function(req,res){
  if(!req.file){
    return res.status(400).send('No files were uploaded.');
  }

  // res.send('File uploaded successfully!');
  const user = await userModel.findOne({username: req.session.passport.user});
  user.dp = req.file.filename;
  await user.save();
  res.redirect("/profile");
});
// -----------------------------------------------

module.exports = router;