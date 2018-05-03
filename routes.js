const routes = (module.exports = require('next-routes')());

routes
  .add('index', '/')
  .add('blog', '/blog/:slug')
  .add('user', '/user/:id', 'profile');
