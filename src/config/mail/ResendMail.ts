import AppError from '@shared/errors/AppError';
import { Resend } from 'resend';
import HandlebarsMailTemplate from './HandlebarsMailTemplate';
import mail from './mail';

interface ITemplateVariable {
  [key: string]: string | number;
}

interface IParseMailTemplate {
  file: string;
  variables: ITemplateVariable;
}

interface ISendMail {
  to: string;
  from?: string;
  subject: string;
  templateData: IParseMailTemplate;
}

const resend = new Resend(mail.config.secret);

export default class ResendMail {
  static async sendMail({ to, from, subject, templateData }: ISendMail): Promise<void> {
    const mailTemplate = new HandlebarsMailTemplate();

    const { error } = await resend.emails.send({
      from: from || 'Equipe API Vendas <thiago@thikachi.dev.br>',
      to,
      subject,
      html: await mailTemplate.parse(templateData),
    });

    if (error) {
      throw new AppError(error.message);
    }
  }
}
