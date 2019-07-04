var express = require('express');
var router = express.Router();
const adminController = require('../controllers/admincontroller');
const auth = require('../config/auth');

/* GET - Private - Admin home page. */
router.get('/', auth.ensureAuthenticatedAdmin, adminController.index_get)

// GET - Public : Login Admin Page
router.get('/login',auth.ensureAuthenticatedAdminLogin, adminController.login_get);

// POST - Public : Login Admin
router.post('/login', adminController.login_post);

// GET - Private : Log out User
router.get('/logout', auth.ensureAuthenticatedAdmin, adminController.logout_get);

// GET - Private : Show Guests List
router.get('/guests', auth.ensureAuthenticatedAdmin, adminController.guests_get);

// GET - Private : Show Signed Waivers of Guest
router.get('/signedwaivers/:guestid', auth.ensureAuthenticatedAdmin, adminController.signedwaivers_get);

// GET - Private : Download Waiver
router.get('/downloadwaiver/:waiverid', auth.ensureAuthenticatedAdmin, adminController.downloadwaiver_get);

// GET - Private : Delete Guest
router.get('/deleteguest/:guestid', auth.ensureAuthenticatedAdmin, adminController.deleteguest_get);

// GET - Private : Show Signed Waivers List
router.get('/signedwaiverslist', auth.ensureAuthenticatedAdmin, adminController.signedwaiverslist_get);

// GET - Private : Delete waiver
router.get('/deletewaiver/:waiverid', auth.ensureAuthenticatedAdmin, adminController.deletewaiver_get);

// GET - Private : Show Account Setting Page
router.get('/accountsettings', auth.ensureAuthenticatedAdmin, adminController.accountsettings_get)

// POST - Private : Change account settings
router.post('/accountsettings', auth.ensureAuthenticatedAdmin, adminController.accountsettings_post)

// GET - Private : Show Change Password Page
router.get('/changepassword', auth.ensureAuthenticatedAdmin, adminController.changepassword_get)

// POST - Private : Change Password
router.post('/changepassword', auth.ensureAuthenticatedAdmin, adminController.changepassword_post)

module.exports = router;
