import { Connection } from 'typeorm';
import request from 'supertest';
import createConnection from '../../../../database';
import { app } from '../../../../app';

let connection: Connection;

describe('Authenticate User', () => {
  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();

    await request(app).post('/api/v1/users').send({
      name: 'Mateus',
      email: 'mateus@gmail.com',
      password: '12345678',
    });
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should authenticate a user', async () => {
    const response = await request(app).post('/api/v1/sessions').send({
      email: 'mateus@gmail.com',
      password: '12345678',
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should not authenticate an user if email is wrong', async () => {
    const response = await request(app).post('/api/v1/sessions').send({
      email: 'wrongEmail',
      password: '12345678',
    });

    expect(response.status).toBe(401);
  });

  it('should not authenticate an user if password is wrong', async () => {
    const response = await request(app).post('/api/v1/sessions').send({
      email: 'mateus@gmail.com',
      password: 'wrongPassword',
    });

    expect(response.status).toBe(401);
  });
});
