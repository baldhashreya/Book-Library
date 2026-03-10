import { Joi } from "celebrate";

export const AuthorModel = {
  Create: {
    params: {},
    query: {},
    body: {
      name: Joi.string().required(),
      bio: Joi.string().required(),
      birthDate: Joi.date().required(),
    },
  },
  Update: {
    params: {
      id: Joi.string().required(),
    },
    query: {},
    body: {
      name: Joi.string().required(),
      bio: Joi.string().required(),
      birthDate: Joi.date().required(),
    },
  },
  Get: {
    params: {
      id: Joi.string().required(),
    },
    query: {},
    body: {},
  },
  Search: {
    params: {},
    query: {},
    body: {
      name: Joi.string().optional(),
      bio: Joi.string().optional(),
      start_birth_date: Joi.date().optional(),
      end_birth_date: Joi.date().optional(),
      limit: Joi.number().optional(),
      offset: Joi.number().optional(),
      order: Joi.array().items(Joi.array().items(Joi.string())).optional(),
    },
  },
};
