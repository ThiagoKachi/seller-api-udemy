import AppError from '@shared/errors/AppError';
import { hash } from 'bcryptjs';
import { addHours, isAfter } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import UsersTokensRepository from '../typeorm/repositories/UserTokensRepository';

interface IRequest {
  token: string;
  password: string;
}

class ResetPasswordService {
  public async execute({ token, password }: IRequest): Promise<void> {
    const usersRepository = getCustomRepository(UsersRepository);
    const userTokensRepository = getCustomRepository(UsersTokensRepository);

    const userToken = await userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('User token does not exists.');
    }

    const user = await usersRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError('User does not exists.');
    }

    const tokenCreatedAt = userToken.created_at;
    const compareDate = addHours(tokenCreatedAt, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('Token expired.');
    }

    user.password = await hash(password, 8);

    await usersRepository.save(user);
  }
}

export default ResetPasswordService;
