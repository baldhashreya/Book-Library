import { Joi } from "celebrate";
import { RolePermission } from "common";
export const RolesModel = {
  Create: {
    params: {},
    body: {
      name: Joi.string().required(),
      permissions: Joi.array()
        .items(Joi.string().valid(...Object.values(RolePermission)))
        .required(),
      description: Joi.string().required(),
    },
    query: {},
  },
  Update: {
    params: {
      id: Joi.string().required(),
    },
    body: {
      name: Joi.string().required(),
      permissions: Joi.array()
        .items(Joi.string().valid(...Object.values(RolePermission)))
        .required(),
      description: Joi.string().required(),
    },
    query: {},
  },
  Get: {
    params: {
      id: Joi.string().required(),
    },
    body: {},
    query: {},
  },
  Search: {
    params: {},
    body: {
      name: Joi.string().optional(),
      permissions: Joi.array()
        .items(Joi.string().valid(...Object.values(RolePermission)))
        .optional(),
      description: Joi.string().optional(),
      offset: Joi.number().optional(),
      limit: Joi.number().optional(),
      order: Joi.array().items(Joi.string()).optional(),
    },
    query: {},
  },
};
