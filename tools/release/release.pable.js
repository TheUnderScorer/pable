const releaseFactory = require('./configFactory');

module.exports = releaseFactory({
  tagFormat: 'client-${version}',
  name: 'pable',
});
