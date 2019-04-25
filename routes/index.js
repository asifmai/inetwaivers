var express = require('express');
var router = express.Router();

const indexController = require('../controllers/indexcontroller');

/* GET home page. */
router.get('/', indexController.index_get);

/* GET home page. */
router.post('/choosewaiver', indexController.choosewaiver_post);

module.exports = router;
