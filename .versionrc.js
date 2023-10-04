// .versionrc.js
module.exports = {
  skip: {
    // CI bot does tagging
    tag: true,
  },
  tagPrefix: '',
  bumpFiles: [{
    filename: 'package.json',
    type: 'json',
  }, {
    filename: 'package-lock.json',
    type: 'json',
  }
  ],
};

