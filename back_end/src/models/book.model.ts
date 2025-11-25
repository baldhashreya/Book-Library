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
      publisher: Joi.number().allow(null, "").required(),
      quantity: Joi.number().allow(null, "").required(),
      coverImage: Joi.string().allow(null, ""),
      status: Joi.string()
        .required()
        .valid(...Object.values(BookStatusEnum))
        .required(),
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
      publisher: Joi.number().required(),
      quantity: Joi.number().required(),
      coverImage: Joi.string(),
      status: Joi.string()
        .required()
        .valid(...Object.values(BookStatusEnum))
        .required(),
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
      publisher: Joi.number().optional(),
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
  AssignBook: {
    params: {
      id: Joi.string().required(),
    },
    query: {},
    body: {
      userId: Joi.string().required(),
      returnDate: Joi.date().required(),
    },
  },
};
