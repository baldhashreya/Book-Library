import { Joi } from "celebrate";

export const AuthorizationModel = {
  login: {
    params: {},
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
    query: {},
  },
  logout: {
    params: { id: Joi.string().required() },
    body: {},
    query: {},
  },
  signup: {
    params: {},
    body: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      role: Joi.string().required(),
    },
    query: {},
  },
  refreshToken: {
    params: { id: Joi.string().required() },
    body: {
      token: Joi.string().required(),
    },
    query: {},
  },
  resetPassword: {
    params: {},
    body: {
      password: Joi.string().required(),
      email: Joi.string().email().required(),
    },
    query: {},
  },
};
