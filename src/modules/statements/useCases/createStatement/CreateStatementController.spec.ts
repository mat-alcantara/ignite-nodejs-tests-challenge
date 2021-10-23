import { Connection } from 'typeorm';
import createConnection from '../../../../database';
import { CreateStatementController } from './CreateStatementController';

let createStatementController: CreateStatementController;

let connection: Connection;

describe('Create Statement', () => {
  beforeAll(async () => {
    createStatementController = new CreateStatementController();
    connection = await createConnection();

    connection.runMigrations();
  });

  afterAll(() => {
    connection.dropDatabase();
  });

  // it('should create a new statement', () => {

  // });
});
