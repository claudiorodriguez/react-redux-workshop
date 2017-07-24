/* eslint-disable import/no-commonjs, import/unambiguous, filenames/match-regex */
const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [
    autoprefixer({
      browsers: [
        '> 1%',
        'last 3 versions',
        'iOS > 8',
        'not ie < 10'
      ]
    })
  ]
};
