import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import ForgotPasswordController from '../controllers/ForgotPasswordController';
import ResetPasswordController from '../controllers/ResetPasswordController';

const passwordRouter = Router();
const forgotPassowordController = new ForgotPasswordController();
const resetPassowordController = new ResetPasswordController();

passwordRouter.post(
  '/forgot',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
    }
  }),
  forgotPassowordController.create
);

passwordRouter.post(
  '/reset',
  celebrate({
    [Segments.BODY]: {
      token: Joi.string().uuid().required(),
      password: Joi.string().min(6).required(),
      password_confirmation: Joi.string().min(6).required().valid(Joi.ref('password')),
    }
  }),
  resetPassowordController.create
);

export default passwordRouter;
