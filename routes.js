const routes = (module.exports = require('next-routes')());

routes
  .add('index', '/')
  .add('questions', '/questions', 'index')
  .add('selected-questions', '/selected-questions', 'index')
  .add('blog', '/blog/:slug')
  .add('user', '/user/:id', 'profile');
