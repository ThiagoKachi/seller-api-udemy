import EtherealMail from '@config/mail/EtherealMail';
import mail from '@config/mail/mail';
import ResendMail from '@config/mail/ResendMail';
import AppError from '@shared/errors/AppError';
import path from 'node:path';
import { getCustomRepository } from 'typeorm';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import UsersTokensRepository from '../typeorm/repositories/UserTokensRepository';

interface IRequest {
  email: string;
}

class SendForgotPasswordEmailService {
  public async execute({ email }: IRequest): Promise<void> {
    const usersRepository = getCustomRepository(UsersRepository);
    const userTokensRepository = getCustomRepository(UsersTokensRepository);

    const user = await usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('User does not exists.');
    }

    const { token } = await userTokensRepository.generate(user.id);

    const forgotPasswordTemplate = path.resolve(__dirname, '..', 'views', 'forgot_password.hbs');

    if (mail.config.driver === 'resend') {
      await ResendMail.sendMail({
        to: user.email,
        subject: 'Recuperação de Senha - API Vendas',
        templateData: {
          file: forgotPasswordTemplate,
          variables: {
            name: user.name,
            link: `${process.env.APP_WEB_URL}/reset_password?token=${token}`
          }
        }
      });

      return;
    }

    await EtherealMail.sendMail({
      to: {
        email: user.email,
        name: user.name
      },
      subject: 'Recuperação de Senha - API Vendas',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          link: `${process.env.APP_WEB_URL}/reset_password?token=${token}`
        }
      }
    });
  }
}

export default SendForgotPasswordEmailService;
