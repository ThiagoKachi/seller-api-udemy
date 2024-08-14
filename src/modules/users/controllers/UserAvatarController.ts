import { instanceToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';
class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const filename = request.file?.filename;

    const updateAvatar = new UpdateUserAvatarService();

    const user = await updateAvatar.execute({
      userId: id,
      avatarFileName: filename!
    });

    return response.json(instanceToInstance(user));
  }
}

export default UserAvatarController;
