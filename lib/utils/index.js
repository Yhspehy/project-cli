const express = require('express');

function server (argv, options) {
  const app = express();

  app.get('/', function (req, res) {
    res.send('Hello Project-Cli!');
  });

  app.listen(argv.port, function () {
    console.log(`
      Example app listening on port ${argv.port}!
      Click http://localhost:${argv.port}
      `);
  });
}

exports.server = server