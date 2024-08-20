import AppError from '@shared/errors/AppError';
import FakeCustomersRepository from '../typeorm/repositories/fakes/FakeCustomersRepository';

let fakeCustomersRepository: FakeCustomersRepository;

describe('Create Customer', () => {
  beforeEach(() => {
    fakeCustomersRepository = new FakeCustomersRepository();
  });

  it('should be able to create a new customer', async () => {
    const customer = await fakeCustomersRepository.create({
      name: 'John Doe',
      email: 'wYJ9B@example.com',
    });

    expect(customer).toHaveProperty('id');
  });

  it('should not be able to create two customers with the same email', async () => {
    await fakeCustomersRepository.create({
      name: 'John Doe',
      email: 'wYJ9B@example.com',
    });

    expect(
      fakeCustomersRepository.create({
        name: 'ThiKachi',
        email: 'wYJ9B@example.com'
      })).rejects.toBeInstanceOf(AppError);
  });
});
