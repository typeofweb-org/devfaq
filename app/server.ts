import * as Hapi from 'hapi';

const server = new Hapi.Server();

server.connection({ port: 3000, host: 'localhost' });

server.route({
  method: 'GET',
  path: '/',
  handler: function (_request, reply) {
    reply('Hello, world!');
  }
});

server.start((err) => {

  if (err) {
    throw err;
  }
  console.log(`Server running at: ${server.info!.uri}`);
});
