var serveWaterfall = require('serve-waterfall');

module.exports = {
  verbose: false,
  webserver: {
    pathMappings: serveWaterfall.mappings.WEB_COMPONENT.concat([

      {'/components/test_test/test/': 'dist'},
    ])
  },
  plugins: {
    local: {
      browsers: ['chrome'/*, 'firefox'*/]
    }
  },
  persistent: true
}
