import { Joi } from "celebrate";
import { BookStatusEnum } from "../../common/enum";

export const BooksModel = {
  Create: {
    params: {},
    body: {
      title: Joi.string().required(),
      author: Joi.string().required(),
      category: Joi.string().required(),
      description: Joi.string().required(),
      isbn: Joi.string().allow(null, ""),
      publisher: Joi.string().allow(null, ""),
      quantity: Joi.number().allow(null, ""),
      coverImage: Joi.string().allow(null, ""),
      status: Joi.string()
        .required()
        .valid(...Object.values(BookStatusEnum)),
    },
    query: {},
  },
  Update: {
    params: {
      id: Joi.string().required(),
    },
    body: {
      title: Joi.string().required(),
      author: Joi.string().required(),
      category: Joi.string().required(),
      description: Joi.string().required(),
      isbn: Joi.string(),
      publisher: Joi.string(),
      quantity: Joi.number(),
      coverImage: Joi.string(),
      status: Joi.string()
        .required()
        .valid(...Object.values(BookStatusEnum)),
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
      title: Joi.string().optional(),
      author: Joi.string().optional(),
      category: Joi.string().optional(),
      description: Joi.string().optional(),
      isbn: Joi.string().optional(),
      publisher: Joi.string().optional(),
      quantity: Joi.number().optional(),
      coverImage: Joi.string().optional(),
      status: Joi.string()
        .optional()
        .valid(...Object.values(BookStatusEnum)),
      offset: Joi.number().optional(),
      limit: Joi.number().optional(),
      order: Joi.array().items(Joi.string()).optional(),
    },
    query: {},
  },
};
