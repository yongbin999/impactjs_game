var express = require('express');
var router = express.Router();

//crawlers
router.get('/robots.txt', function(req, res, next) {
  res.sendfile('robots.txt', {root: __dirname });
});

router.get('/sitemap.xml', function(req, res, next) {
  res.sendfile('sitemap.xml', {root: __dirname });
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
