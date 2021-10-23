import { Connection } from 'typeorm';
import request from 'supertest';
import { app } from '../../../../app';
import createConnection from '../../../../database';

let connection: Connection;

describe('Show user profile', () => {
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

  it('should show the user profile', async () => {
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'mateus@gmail.com',
      password: '12345678',
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .get('/api/v1/profile')
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
  });

  it('should not show user profile if token is invalid', async () => {
    const response = await request(app).get('/api/v1/profile').set({
      Authorization: `Bearer wrongToken`,
    });

    expect(response.status).toBe(401);
  });
});
