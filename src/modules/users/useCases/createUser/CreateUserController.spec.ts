import { Connection } from 'typeorm';
import request from 'supertest';
import createConnection from '../../../../database';
import { app } from '../../../../app';

let connection: Connection;

describe('Create User', () => {
  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should create a new user', async () => {
    const response = await request(app).post('/api/v1/users').send({
      name: 'Mateus',
      email: 'mateus@gmail.com',
      password: '12345678',
    });

    expect(response.status).toBe(201);
  });

  it('should not create a new user with email already used', async () => {
    await request(app).post('/api/v1/users').send({
      name: 'Mateus',
      email: 'mateus@gmail.com',
      password: '12345678',
    });

    const response = await request(app).post('/api/v1/users').send({
      name: 'Mateus',
      email: 'mateus@gmail.com',
      password: '12345678',
    });

    expect(response.status).toBe(400);
  });
});
