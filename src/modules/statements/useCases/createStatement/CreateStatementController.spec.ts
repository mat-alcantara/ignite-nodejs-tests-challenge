import { Connection } from 'typeorm';
import request from 'supertest';
import { app } from '../../../../app';
import createConnection from '../../../../database';

let connection: Connection;

describe('Create Statement', () => {
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

  it('should create a new deposit statement', async () => {
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'mateus@gmail.com',
      password: '12345678',
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post('/api/v1/statements/deposit')
      .send({
        amount: 100,
        description: 'test',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
  });

  it('should create a new withdraw statement', async () => {
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'mateus@gmail.com',
      password: '12345678',
    });

    const { token } = responseToken.body;

    await request(app)
      .post('/api/v1/statements/deposit')
      .send({
        amount: 1000,
        description: 'test',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const response = await request(app)
      .post('/api/v1/statements/withdraw')
      .send({
        amount: 100,
        description: 'test',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
  });

  it('should not be able to create if not authenticated', async () => {
    const response = await request(app)
      .post('/api/v1/statements/deposit')
      .send({
        amount: 100,
        description: 'test',
      })
      .set({
        Authorization: `Bearer wrongToken`,
      });

    expect(response.status).toBe(401);
  });
});
