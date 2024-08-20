import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import { sign } from 'jsonwebtoken';
import { getCustomRepository } from 'typeorm';
import BcryptHashProvider from '../providers/HashProvider/implementations/BcryptHashProvider';
import User from '../typeorm/entities/User';
import UsersRepository from '../typeorm/repositories/UsersRepository';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

class CreateSessionService {
  constructor(private hashProvider: BcryptHashProvider) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const usersRepository = getCustomRepository(UsersRepository);
    const user = await usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Invalid credentials.', 401);
    }

    const passwordConfirmed = await this.hashProvider.compareHash(password, user.password);

    if (!passwordConfirmed) {
      throw new AppError('Invalid credentials.', 401);
    }

    const token = sign({}, authConfig.jwt.secret, {
      expiresIn: authConfig.jwt.expiresIn,
      subject: user.id
    });

    return {
      user,
      token
    };
  }
}

export default CreateSessionService;
