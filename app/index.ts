import 'reflect-metadata';
import 'typeorm-typedi-extensions';

import { Container } from 'typedi';
import { db } from './db';
import { UserService } from './entity/user/User.service';
import { serverPromise } from './server';

const init = async () => {
  await db;
  const server = await serverPromise;
  await server.start();

  console.log(UserService);
  const userService = Container.get(UserService);
  // const userService = getCustomRepository(UserService);
  await userService.repository.clear();

  const user = userService.repository.create({
    emailAddress: 'michal@miszczyszyn.com',
    password: 'qwerty123',
  });
  await userService.repository.save(user);

  const users = await userService.repository.find();
  console.log(users);

  return server;
};

init()
  .then((server) => console.log(`Server running at: ${server.info!.uri}`))
  .catch((err) => console.error(err));
