import { instanceToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import BcryptHashProvider from '../providers/HashProvider/implementations/BcryptHashProvider';
import CreateUserService from '../services/CreateUserService';
import ListUsersService from '../services/ListUsersService';

const hashProvider = new BcryptHashProvider();

class UsersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listUsers = new ListUsersService();

    const users = await listUsers.execute();

    return response.json(instanceToInstance(users));
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const createUser = new CreateUserService(hashProvider);

    const user = await createUser.execute({
      name,
      email,
      password
    });

    return response.status(201).json(instanceToInstance(user));
  }
}

export default UsersController;
