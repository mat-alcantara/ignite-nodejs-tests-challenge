import { GetStatementOperationUseCase } from './GetStatementOperationUseCase';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { OperationType } from '../createStatement/CreateStatementController';

let getStatementOperationUseCase: GetStatementOperationUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe('Get Statement Operation', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();

    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository,
    );
  });

  it('should get user statement operations', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'Mateus',
      email: 'mateus@gmail.com',
      password: '12345678',
    });

    const statement = await inMemoryStatementsRepository.create({
      amount: 1000,
      description: 'Salário',
      type: OperationType.DEPOSIT,
      user_id: user.id || 'wrongId',
    });

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: statement.id,
    });

    expect(statementOperation).toHaveProperty('id');
    expect(statementOperation.id).toBe(statement.id);
    expect(statementOperation.user_id).toBe(user.id);
  });
});
