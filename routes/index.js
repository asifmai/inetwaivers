var express = require('express');
var router = express.Router();

const indexController = require('../controllers/indexcontroller');
const auth = require('../config/auth')

/* GET home page. */
router.get('/', indexController.index_get);

/* GET Choose Waiver. */
router.get('/choosewaiver', auth.ensureAuthenticated, indexController.choosewaiver_get);

/* GET Waiver Page. */
router.get('/waiver/:waiverid', auth.ensureAuthenticated, indexController.waiver_get);

/* POST Submit Waiver. */
router.post('/submitwaiver', auth.ensureAuthenticated, indexController.submitwaiver_post);

module.exports = router;
