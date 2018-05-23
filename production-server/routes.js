"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nextRoutes = require("next-routes");
const routes = nextRoutes();
routes
    .add('index', '/')
    .add('questions', '/questions/:technology?')
    .add('selected-questions', '/selected-questions', 'selectedQuestions')
    .add('about', '/about', 'staticPage')
    .add('authors', '/authors', 'staticPage')
    .add('regulations', '/regulations', 'staticPage');
// .add('blog', '/blog/:slug')
// .add('user', '/user/:id', 'profile');
exports.default = routes;
exports.Link = routes.Link;
exports.Router = routes.Router;
//# sourceMappingURL=routes.js.map