// Show index page
module.exports.index_get = (req, res, next) => {
  res.render('index', {page: 'homepage'});
}

// Show Choose Waiver Page
module.exports.choosewaiver_get = (req, res, next) => {
  res.render('choosewaiver');
}

// Show Waiver Page
module.exports.waiver_get = (req, res, next) => {
  console.log(req.params.waiverid);
  res.render('waiver');
}