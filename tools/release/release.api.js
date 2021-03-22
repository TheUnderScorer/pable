const releaseFactory = require('./configFactory');

module.exports = releaseFactory({
  tagFormat: 'api-${version}',
  name: 'api',
});
