var express = require('express'),
    fs = require('fs'),
    router = express.Router();

router.get('/', function(req, res) {
    res.send(fs.readFileSync('./example/simple-express-app/public/index.html', "utf8"));
});

module.exports = router;