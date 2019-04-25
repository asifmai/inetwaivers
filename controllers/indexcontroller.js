// Show index page
module.exports.index_get = (req, res, next) => {
  res.render('index', {page: req.url});
}

// Show Choose Waiver Page
module.exports.choosewaiver_post = (req, res, next) => {
  res.locals.guestemail = req.body.email;
  res.render('choosewaiver');
}