module.exports = function (app) {
  app.use(handleClientRoutes);
};

const clientRoutes = ['/host/', '/player/'];

function handleClientRoutes(req, res, next) {
  let url = req.path;
  if (url.slice(-1) !== '/') url += '/';
  
  if (clientRoutes.some( r => r === url)) {
    req.url = '/';
  }

  return next();
}