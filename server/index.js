var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var logger = require('morgan');
var bodyParser = require('body-parser');
var Wikipedia = require('./services/wikipedia');
var db = require('./db');

var app = express();
var wiki = new Wikipedia(db);

var hbs = exphbs.create({
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  partialsDir: path.join(__dirname, 'views', 'partials')
});


// Configuration and middleware
// ----------------------------

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine);
app.engine('html', hbs.engine);
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


// Routes
// ------

app.get('/', function (req, res) {
  res.render('index');
});

app.post('/', function (req, res) {
  var url = req.body.url;
  var philosophy = 'https://en.wikipedia.org/wiki/Philosophy';

  wiki.getPagesBetween(url, philosophy).then(function (pages) {

    res.render('index', {
      results: pages
    });

  });
})


module.exports = app;
