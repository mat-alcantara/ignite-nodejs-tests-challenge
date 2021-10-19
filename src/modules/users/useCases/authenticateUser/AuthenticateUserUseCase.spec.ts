import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';
import { IncorrectEmailOrPasswordError } from './IncorrectEmailOrPasswordError';

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe('Authenticate User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();

    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository,
    );
  });

  it('should authenticate user', async () => {
    const user = await createUserUseCase.execute({
      name: 'Mateus',
      email: 'mateus@gmail.com',
      password: '12345678',
    });

    const userAuthenticated = await authenticateUserUseCase.execute({
      email: user.email,
      password: '12345678',
    });

    expect(userAuthenticated).toHaveProperty('token');
  });

  it('should not authenticate user if it does not exist', async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: 'wrongEmail',
        password: 'wrongPassword',
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it('should not authenticate user if password is incorrect', async () => {
    const user = await createUserUseCase.execute({
      name: 'Mateus',
      email: 'mateus@gmail.com',
      password: '12345678',
    });

    expect(async () => {
      await authenticateUserUseCase.execute({
        email: user.email,
        password: 'wrongPassword',
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
