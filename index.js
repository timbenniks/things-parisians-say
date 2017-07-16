const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const config = require('./config.json')
const browserify = require('browserify-middleware')
const sass = require('express-sass-middleware')
const babelify = require('babelify')
const getProverb = require('./models/proverb')
const getProverbs = require('./models/proverbs')

const app = express()
const port = process.env.PORT || '5100'

browserify.settings({
  transform: [
    [babelify, { presets: ['es2015'], plugins: ['transform-object-assign', 'es6-promise'] }]
  ],
  production: {
    cache: true,
    precompile: true,
    minify: true,
    gzip: true,
    debug: false,
  },
  development: {
    cache: 'dynamic',
    precompile: false,
    minify: false,
    gzip: false,
    debug: true
  }
})

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use((req, res, next) => {
  res.header('X-powered-by', config.title)
  res.header('Access-Control-Allow-Origin', '*')
  req.env = app.settings.env
  next()
})

app.get('/', (req, res) => {
  getProverbs()
    .then(result => { res.render('index', { config, proverbs: result.data }) })
    .catch(error => { res.render('error', { config, error }) })
})

app.get('/proverb/:id', (req, res) => {
  getProverb(req.params.id)
    .then(result => { res.render('proverb', { config, proverb: result.data }) })
    .catch(error => { res.render('error', { config, error }) })
})

app.use('/app.js', browserify(path.join(__dirname, '/public/scripts/app.js')))

app.get('/styles.css', sass({
  file: path.join(__dirname, '/public/styles/styles.scss'),
  watch: true,
  precompile: true,
  outputStyle: 'compressed'
}))

app.use((req, res, next) => {
  var err = new Error( 'Not Found' );
  err.status = 404;
  next( err );
});

app.use( ( err, req, res, next )=>{
  res.status( err.status || 500 );
  res.render( 'error', {
    message: err.message,
    error: err
  });
});

app.listen(port)