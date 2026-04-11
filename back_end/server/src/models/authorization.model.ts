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
      name: Joi.string().min(1).trim().required(),
      email: Joi.string().email().min(1).trim().required(),
      password: Joi.string().min(1).trim().required(),
      role: Joi.string().min(1).trim().required(),
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
