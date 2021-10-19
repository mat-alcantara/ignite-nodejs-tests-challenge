import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { OperationType } from './CreateStatementController';
import { CreateStatementUseCase } from './CreateStatementUseCase';

let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe('Create Statement', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();

    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository,
    );
  });

  it('should create a new statement', async () => {
    const user = await createUserUseCase.execute({
      name: 'Mateus',
      email: 'mateus@gmail.com',
      password: '12345678',
    });

    const statement = await createStatementUseCase.execute({
      amount: 1000,
      description: 'Salário',
      type: OperationType.DEPOSIT,
      user_id: user.id || 'wrongId',
    });

    expect(statement).toHaveProperty('id');
  });

  // it('should not create a new statement if user does not exist', async () => {});

  // it('should not create a withdraw if there is insuficient founds', async () => {});
});
