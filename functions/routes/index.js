/* eslint-disable new-cap */
const express = require("express");
const router = express.Router();

// crawlers
router.get("/robots.txt", function(req, res, next) {
  res.sendFile("robots.txt", {root: "public"});
});

router.get("/sitemap.xml", function(req, res, next) {
  res.sendFile("sitemap.xml", {root: "public"});
});

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", {title: "Express"});
});

router.get("/about", function(req, res, next) {
  res.render("about", {title: "Express"});
});

router.get("/credits", function(req, res, next) {
  res.render("credits", {title: "Express"});
});

router.get("/ads", function(req, res, next) {
  res.render("video_ads", {title: "Express"});
});

module.exports = router;
