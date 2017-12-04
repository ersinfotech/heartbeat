var ip = require('ip')
var http = require('http')
var https = require('https')
var request = require('request-promise')
var moment = require('moment')

var lastRequestTime = moment().toISOString()
var recordLastRequestTime = function (options) {
  if (options.host !== 'heartbeat-api.ersinfotech.com') {
    lastRequestTime = moment().toISOString()
  }
}

var originHttpRequest = http.request
http.request = function (options) {
  recordLastRequestTime(options)
  return originHttpRequest.apply(this, arguments)
}
var originHttpsRequest = https.request
https.request = function (options) {
  recordLastRequestTime(options)
  return originHttpsRequest.apply(this, arguments)
}

var data = {
  ip: ip.address(),
  path: process.cwd(),
}

var type = 'start'
var interval = 0
var disableDetectRequest = false
var detectRequestInterval = 15

var ping = function() {
  request({
    method: 'post',
    url: 'http://heartbeat-api.ersinfotech.com/graphql',
    json: true,
    body: {
      query: "mutation ping ($ip: String! $path: String! $type: String) {ping(ip: $ip path: $path type: $type)}",
      variables: {
        ip: data.ip,
        path: data.path,
        type: type,
      },
    },
  })
  .catch(function(err) {
    console.error(err.message)
  })
}

var loop = function() {
  setTimeout(function() {
    if (disableDetectRequest) {
      ping()
    } else if (moment().diff(lastRequestTime, 'minutes', true) < detectRequestInterval) {
      ping()
    }
    type = 'live'
    interval = 30
    loop()
  }, interval * 1000)
}

module.exports = function(options) {
  options = options || {}
  disableDetectRequest = options.disableDetectRequest || disableDetectRequest
  detectRequestInterval = options.detectRequestInterval || detectRequestInterval
  loop()
}

module.exports()