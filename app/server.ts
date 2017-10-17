import * as Hapi from 'hapi';

const server = new Hapi.Server();

server.connection({ port: 3000, host: 'localhost' });

server.route({
  method: 'GET',
  path: '/',
  handler(_request, reply) {
    reply('Hello, world!');
  },
});

export { server };
