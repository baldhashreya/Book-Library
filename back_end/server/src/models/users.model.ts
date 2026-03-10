import { Joi } from "celebrate";
import { UserStatusEnum } from "common";

export const UserModel = {
  Create: {
    params: {},
    body: {
      name: Joi.string().trim().required(),
      email: Joi.string().email().trim().required(),
      role: Joi.string().required().trim(),
      address: Joi.string().required().trim(),
      phone: Joi.number().integer().required(),
    },
    query: {},
  },
  Update: {
    params: { id: Joi.string().required() },
    body: {
      status: Joi.string()
        .required()
        .valid(...Object.values(UserStatusEnum)),
      name: Joi.string().trim().required(),
      email: Joi.string().email().trim().required(),
      role: Joi.string().required().trim(),
      address: Joi.string().required().trim(),
      phone: Joi.number().integer().required(),
    },
    query: {},
  },
  Get: {
    params: { id: Joi.string().required() },
    body: {},
    query: {},
  },
  Search: {
    params: {},
    body: {
      userName: Joi.string().optional(),
      email: Joi.string().optional(),
      role: Joi.string().optional(),
      status: Joi.string()
        .optional()
        .valid(...Object.values(UserStatusEnum)),
      offset: Joi.number().optional(),
      limit: Joi.number().optional(),
      order: Joi.array().items(Joi.array().items(Joi.string())).optional(),
    },
    query: {},
  },
  UpdateStatus: {
    params: {
      id: Joi.string().required(),
    },
    query: {},
  },
};
