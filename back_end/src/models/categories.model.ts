import { Joi } from "celebrate";
import { UserStatusEnum } from "../../common/enum";

export const CategoriesModel = {
  Create: {
    params: {},
    body: {
      name: Joi.string().required(),
    },
    query: {},
  },
  Update: {
    params: { id: Joi.string().required() },
    body: {
      name: Joi.string().required(),
      status: Joi.string().valid(...Object.values(UserStatusEnum)),
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
      name: Joi.string().optional(),
      status: Joi.string()
        .valid(...Object.values(UserStatusEnum))
        .optional(),
      offset: Joi.number().optional(),
      limit: Joi.number().optional(),
      order: Joi.array().items(Joi.string()).optional(),
    },
    query: {},
  },
  CreateMoreCategories: {
    params: {},
    body: {
      name: Joi.array().required().items(Joi.string().required()),
    },
    query: {},
  },
};
