const routes = (module.exports = require('next-routes')());

routes
  .add('index', '/')
  .add('questionsIndex', '/questions', 'questions')
  .add('questions', '/questions/:technology')
  .add('selected-questions', '/selected-questions', 'index')
  .add('about', '/about', 'staticPage')
  .add('authors', '/authors', 'staticPage')
  .add('regulations', '/regulations', 'staticPage');
// .add('blog', '/blog/:slug')
// .add('user', '/user/:id', 'profile');
