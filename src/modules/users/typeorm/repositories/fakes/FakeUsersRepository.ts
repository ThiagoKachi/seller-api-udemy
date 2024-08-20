import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';
import { randomUUID } from 'node:crypto';
import User from '../../entities/User';

export interface IPaginateUser {
  per_page: number;
  total: number;
  current_page: number;
  data: User[];
}

class FakeUsersRepository {
  constructor(private hashProvider: FakeHashProvider) {}

  private users: User[] = [];

  public async create({ name, email, password }: { name: string; email: string; password: string }): Promise<User> {
    const user = new User();

    user.id = randomUUID();
    user.name = name;
    user.email = email;
    user.password = await this.hashProvider.generateHash(password);

    const emailAlreadyExists = this.users.find((user) => user.email === email);

    if (emailAlreadyExists) {
      throw new AppError('Email address already used.');
    }

    this.users.push(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(findUser => findUser.id === user.id);

    this.users[findIndex] = user;

    return user;
  }

  public async findAll(): Promise<User[]> {
    return this.users;
  }

  public async findAllPaginate(): Promise<IPaginateUser> {
    const usersPaginate = {
      from: 1,
      to: 1,
      per_page: 1,
      total: 1,
      current_page: 1,
      prev_page: null,
      next_page: null,
      data: this.users,
    };

    return usersPaginate;
  }

  public async findByName(name: string): Promise<User | undefined> {
    const user = this.users.find(user => user.name === name);
    return user;
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = this.users.find(user => user.id === id);
    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = this.users.find(user => user.email === email);
    return user;
  }
}

export default FakeUsersRepository;
