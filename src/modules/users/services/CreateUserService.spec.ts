import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../typeorm/repositories/fakes/FakeUsersRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

describe('Create User', () => {
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider();
    fakeUsersRepository = new FakeUsersRepository(fakeHashProvider);
  });

  it('should be able to create a new user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'wYJ9B@example.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create two users with the same email', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'wYJ9B@example.com',
      password: '123456',
    });

    expect(
      fakeUsersRepository.create({
        name: 'ThiKachi',
        email: 'wYJ9B@example.com',
        password: '123456',
      })).rejects.toBeInstanceOf(AppError);
  });
});
