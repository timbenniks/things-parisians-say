const request = require('request-promise-native')

module.exports = (url) => request({ uri: url, json: true, headers: { 'Authorization': 'Token token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhcHBfdXVpZCI6IjcyOGQ3YTkzLTMwNWQtNGNkOS05NDQxLTAwZDY5NTczODc4MiIsImlkIjo1NiwidXBkYXRlZF9hdCI6IjIwMTctMDctMTUgMTM6NDA6MTIgVVRDIn0.9t0JVc_J7VrHcSSmtjUuw7oW7LRo_Q-QuLoy8H7mf_A' }})
