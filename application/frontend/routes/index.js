const Express = require('express');
const router = Express.Router();
const fetch = require('node-fetch');
const { isAuthenticated } = require('../middleware/auth'); 

router.get('/', (req, res) => {
  res.render('home', { title: 'DormMates - Home', user: req.user });
});

router.get('/soon', (req, res) => {
  res.render('soon', { title: 'DormMates - Coming Soon', user: req.user });
});

router.get('/login', (req, res) => {
  res.render('login', { title: 'DormMates - log in', user: req.user });
});

router.get('/register', (req, res) => {
  res.render('register', { title: 'DormMates - Student Register', user: req.user });
});

router.get('/listing/post', isAuthenticated, (req, res) => {
  if(req.user.landlord) {
    res.render('postalisting', { title: 'DormMates - Landlord Post a listing', user: req.user });
  } else {
    res.redirect('/');
    // TODO: Add error page
  }
});

router.get('/listing/edit/:id', isAuthenticated, (req, res) => {
  if(req.user.landlord) {
    let baseUrl = req.protocol + '://' + req.get('host');
    let listingId = req.params.id;
    
    fetch(`${baseUrl}/listings/${listingId}`, {
      method: "GET"
    })
    .then((response) => response.json())
    .then((response) => {
      res.render('editlisting', { title: 'DormMates - Edit Listing', user: req.user, data: response.listing });
    })
    .catch((err) => {
      res.redirect('/');
    })
  } else {
    res.render('/');
  }
});

router.get('/features', (req, res) => {
  res.render('features', { title: 'DormMates - Features', user: req.user });
});

router.get('/tos', (req, res) => {
  res.render('tos', { title: 'DormMates - Terms of Service', user: req.user });
});

router.get('/faq', (req, res) => {
  res.render('faq', { title: 'DormMates - Frequently Asked Questions', user: req.user });
});

router.get('/questionnaire/:id', (req, res) => {
  res.render('questionnaire', { title: 'DormMates - Questionnaire', user: req.user, id: req.params.id });
});

router.get('/profile', isAuthenticated, (req, res) => {
  res.render('profile', { title: 'DormMates - Profile', user: req.user});
});

router.get('/profile/:id', isAuthenticated, (req, res) => {
  let baseUrl = req.protocol + '://' + req.get('host');
  let userId = req.params.id;

  fetch(`${baseUrl}/search/user/${userId}`, {
    method: "GET"
  })
  .then((response) => response.json())
  .then((response) => {
    res.render('profile', { title: 'DormMates - Profile', user: response.user });
  })
  .catch((err) => {
    console.log(err);
  })
  
});

router.get('/profile/edit', isAuthenticated, (req, res) => {
  res.render('editprofile', { title: 'DormMates - Edit Profile', user: req.user, });
});

router.get('/roommates', isAuthenticated, (req, res) => {
  res.render('roommates', { title: 'DormMates - Roommates Page', user: req.user });
});

router.get('/listings', isAuthenticated, (req, res) => {
  res.render('listings', { title: 'DormMates - Student List Page', user: req.user });
});

router.get('/listing/:id', isAuthenticated, (req, res) => {
  let baseUrl = req.protocol + '://' + req.get('host');
  let listingId = req.params.id;
  
  fetch(`${baseUrl}/listings/${listingId}`, {
    method: "GET"
  })
  .then((response) => response.json())
  .then((response) => {
    res.render('listing', { title: 'DormMates - Listing', user: req.user, data: response.listing, photos: response.photos });
  })
  .catch((err) => {
    console.log(err);
  })
});

router.get('/chat', isAuthenticated, (req, res) => {
  res.redirect('/soon');
});

router.get('/dashboard', isAuthenticated, (req, res) => {
  if(req.user.student) {
    // render student dashboard if the user is a student
    res.render('studentdashboard', { title: 'DormMates - studentdashboard', user: req.user });
  } else {
    // render the landlord dashboard if the user is a landlord
    res.render('landlorddashboard', { title: 'DormMates - landlorddashboard', user: req.user });
  }
});

router.get('/about', (req, res) => {
  res.render('about', { title: 'DormMates - About Us', user: req.user });
});

router.get('/about/andrei', (req, res) => {
  res.render('about/andrei', {
    name: 'Andrei Georgescu',
    title: 'Team Lead',
    description: 'Born in Romania, enjoys to work on the backend, graduating SFSU this fall!',
    avatar: '/images/andrei_profile_photo.png',
  });
});

router.get('/about/jonathan', (req, res) => {
  res.render('about/jonathan', {
    name: 'Jonathan McGrath',
    title: 'Backend Lead',
    description: 'Born in Fort Lauderdale, Florida. Ex Submariner USN. SWE .SFSU Student',
    avatar: '/images/jonathan_photo.jpg',
  });
});

router.get('/about/ahad', (req, res) => {
  res.render('about/ahad', {
    name: 'Ahad Zafar',
    title: 'Engineer',
    description: 'Graduating this fall. I like working on both front-end and back-end',
    avatar: '/images/Ahad_profile.jpg',
  });
});

router.get('/about/jimmy', (req, res) => {
  res.render('about/jimmy', {
    name: 'Jimmy Yeung',
    title: 'Engineer',
    description: 'I am born in California, bay area and going to graduate this fall.',
    avatar: '/images/jimmy_profile_photo.png',
  });
});

router.get('/about/Sayed', (req, res) => {
  res.render('about/sayed', {
    name: 'Sayed Hamid',
    title: 'Engineer',
    description: 'Born in Afg,  graduating SFSU this fall!',
    avatar: '/images/sayed.jpg',
  });
});

router.get('/about/alex', (req, res) => {
  res.render('about/alex', {
    name: 'Alexandre Ruffo',
    title: 'Engineer',
    description: 'Born in the United States, enjoyed working with java, hoping to graduate by this winter',
    avatar: '/images/alex_profile_photo.jpg',
  });
});

router.get('/about/meeka', (req, res) => {
  res.render('about/meeka', {
    name: 'Meeka Cayabyab',
    title: 'Frontend Lead',
    description: 'Hello! I like drawing and designing therefore I find working in frontend enjoyable. I will be graduating in spring 2022!',
    avatar: '/images/meeka_profile_photo.jpg',
  });
});

module.exports = router;
