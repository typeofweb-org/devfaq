import { Container } from 'typedi';
import { createConnection, useContainer } from 'typeorm';

useContainer(Container);
const db = createConnection();

export { db };
