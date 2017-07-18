const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const config = require('./config.json')
const browserify = require('browserify-middleware')
const sass = require('express-sass-middleware')
const babelify = require('babelify')
const apicache = require('apicache')
const getProverb = require('./models/proverb')
const getProverbs = require('./models/proverbs')
const RSS = require('rss')

const app = express()
const cache = apicache.middleware
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

//app.use(cache('20 minutes'))

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

app.get('/rss', (req, res) => {
  getProverbs()
    .then(result => {

      const feedConfig = {
        title: config.title,
        description: config.description,
        feed_url: `${config.baseurl}rss`,
        site_url: config.baseurl,
        image_url: 'http://timbenniks.nl/assets/french/french.jpg',
        managingEditor: 'Tim Benniks',
        webMaster: 'Tim Benniks',
        copyright: '2017 Tim Benniks',
        language: 'en',
        categories: ['French', 'Proverbs', 'Learning', 'Culture'],
        pubDate: result.data[0].updated_at,
        ttl: '60'
      }

      const feed = new RSS(feedConfig)

      result.data.forEach( (item) => {
        feed.item({
          title: item.proverb,
          description: ( item.revisionCleaned ) ? item.revisionCleaned : item.explanationCleaned,
          url: config.baseurl + "proverb/" + item.id,
          date: item.updatedat
        })
      })

      res.set('Content-Type', 'text/xml')
      res.send(feed.xml())
    })
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
