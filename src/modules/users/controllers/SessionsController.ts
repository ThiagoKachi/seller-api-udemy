import { instanceToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import BcryptHashProvider from '../providers/HashProvider/implementations/BcryptHashProvider';
import CreateSessionService from '../services/CreateSessionService';

const hashProvider = new BcryptHashProvider();

class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const createSession = new CreateSessionService(hashProvider);

    const user = await createSession.execute({
      email,
      password
    });

    return response.status(201).json(instanceToInstance(user));
  }
}

export default SessionsController;
