var ip = require('ip')
var http = require('http')
var request = require('request-promise')

var data = {
  ip: ip.address(),
  path: process.cwd(),
}

var type = 'start'
var interval = 0

module.exports = function() {
  setTimeout(function() {
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
    type = 'live'
    interval = 30
    module.exports()
  }, interval * 1000)
}
