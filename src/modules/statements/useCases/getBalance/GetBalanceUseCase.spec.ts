import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { GetBalanceError } from './GetBalanceError';
import { GetBalanceUseCase } from './GetBalanceUseCase';

let getBalanceUseCase: GetBalanceUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe('Get Balance', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();

    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository,
    );
  });

  it('should get user balance', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'Mateus',
      email: 'mateus@gmail.com',
      password: '12345678',
    });

    const balance = await getBalanceUseCase.execute({ user_id: user.id });

    expect(balance).toHaveProperty('balance');
    expect(balance.balance).toBe(0);
  });

  it('should not get user balance if user is wrong', async () => {
    expect(async () => {
      await getBalanceUseCase.execute({ user_id: 'wrongId' });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
