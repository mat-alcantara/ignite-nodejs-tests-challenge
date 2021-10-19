import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { ShowUserProfileError } from './ShowUserProfileError';
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe('Authenticate User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();

    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository,
    );
  });

  it('should show a user profile', async () => {
    const userCreated = await inMemoryUsersRepository.create({
      name: 'Mateus',
      email: 'mateus@gmail.com',
      password: '12345678',
    });

    const user = await showUserProfileUseCase.execute(userCreated.id);

    expect(user).toHaveProperty('id');
  });

  it('should not show a user profile if it does not exist', async () => {
    expect(async () => {
      await showUserProfileUseCase.execute('wrongId');
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
