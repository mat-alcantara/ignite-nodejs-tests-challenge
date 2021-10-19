import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserError } from './CreateUserError';
import { CreateUserUseCase } from './CreateUserUseCase';

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe('Create User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();

    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it('should create a new user', async () => {
    const user = await createUserUseCase.execute({
      name: 'Mateus',
      email: 'mateus@gmail.com',
      password: '12345678',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not create a new user if it already exists', async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: 'Mateus',
        email: 'mateus@gmail.com',
        password: '12345678',
      });

      await createUserUseCase.execute({
        name: 'Mateus',
        email: 'mateus@gmail.com',
        password: '12345678',
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
