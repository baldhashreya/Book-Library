import { Joi } from "celebrate";
import { UserStatusEnum } from "../../common/enum";

export const UserModel = {
  Create: {
    params: {},
    body: {
      firstName : Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      role: Joi.string().required(),
      address: Joi.string().required(),
      phone: Joi.string().required(),
    },
    query: {},
  },
  Update: {
    params: { id: Joi.string().required() },
    body: {
      status: Joi.string().required().valid(...Object.values(UserStatusEnum)),
      firstName : Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      role: Joi.string().required(),
      address: Joi.string().required(),
      phone: Joi.string().required(),
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
      status: Joi.string().optional().valid(...Object.values(UserStatusEnum)),
      offset: Joi.number().optional(),
      limit: Joi.number().optional(),
      order: Joi.array().items(Joi.string()).optional(),
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
