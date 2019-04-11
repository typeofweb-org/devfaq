// import { expect } from 'chai';
// import { Server } from 'hapi';
// import { getServerWithPlugins } from '../../server';
// import { Session } from '../../models/Session';
// import { seedTestUser } from '../../tests/integrationTestsUtils';

// describe('helloWorldRoute', async () => {
//   let devfaqServer: Server;

//   beforeEach(async () => {
//     devfaqServer = await getServerWithPlugins();
//     await seedTestUser();
//   });

//   it('should throw when user is not logged in', async () => {
//     const res = await devfaqServer.inject({
//       method: 'GET',
//       url: '/helloWorld',
//       headers: {
//         Authorization: `Bearer incorrect_token`,
//       },
//     });
//     expect(res.statusCode).to.eql(401);
//   });

//   it('should return hello, world!', async () => {
//     const session = await Session.findOne();
//     const res = await devfaqServer.inject({
//       method: 'GET',
//       url: '/helloWorld',
//       headers: {
//         Authorization: `Bearer ${session!.id}`,
//       },
//     });
//     expect(res.statusCode).to.eql(200);
//     expect(res.result).to.eql('Hello, world!');
//   });
// });
