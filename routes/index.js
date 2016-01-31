var express = require('express');
var router = express.Router();

//crawlers
router.get('/robots.txt', function(req, res, next) {
  res.render('robots', { title: 'Express' });
});

router.get('/sitemap.xml', function(req, res, next) {
  res.render('sitemap', { title: 'Express' });
});



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'Express' });
});

router.get('/credits', function(req, res, next) {
  res.render('credits', { title: 'Express' });
});

router.get('/ads', function(req, res, next) {
  res.render('video_ads', { title: 'Express' });
});


module.exports = router;
