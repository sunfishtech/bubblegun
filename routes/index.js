
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Oh, hello my little chicken pie...' });
};