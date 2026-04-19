import { Joi } from "celebrate";
import { BookStatusEnum } from "common";

export const BooksModel = {
  Create: {
    params: {},
    body: {
      title: Joi.string().trim().required().min(3).max(50).regex(/^[^<>]*$/, "no HTML tags allowed"),
      author: Joi.string().trim().required(),
      category: Joi.string().trim().required(),
      description: Joi.string().trim().required().regex(/^[^<>]*$/, "no HTML tags allowed"),
      isbn: Joi.string().allow(null, "").trim(),
      publisher: Joi.number().min(0).integer().required(),
      quantity: Joi.number().min(0).integer().required(),
      coverImage: Joi.string().allow(null, "").trim().regex(/^[^<>]*$/, "no HTML tags allowed"),
      status: Joi.string()
        .valid(...Object.values(BookStatusEnum))
        .required()
        .trim(),
    },
    query: {},
  },
  Update: {
    params: {
      id: Joi.string().required(),
    },
    body: {
      title: Joi.string().trim().required().min(3).max(50).regex(/^[^<>]*$/, "no HTML tags allowed"),
      author: Joi.string().trim().required(),
      category: Joi.string().trim().required(),
      description: Joi.string().trim().required().regex(/^[^<>]*$/, "no HTML tags allowed"),
      isbn: Joi.string().allow(null, "").trim(),
      publisher: Joi.number().required().min(0).integer(),
      quantity: Joi.number().required().min(0).integer(),
      coverImage: Joi.string().allow(null, "").regex(/^[^<>]*$/, "no HTML tags allowed"),
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
      title: Joi.string().optional().regex(/^[^<>]*$/, "no HTML tags allowed"),
      author: Joi.string().optional().regex(/^[^<>]*$/, "no HTML tags allowed"),
      category: Joi.string().optional().regex(/^[^<>]*$/, "no HTML tags allowed"),
      description: Joi.string().optional().regex(/^[^<>]*$/, "no HTML tags allowed"),
      isbn: Joi.string().optional().regex(/^[^<>]*$/, "no HTML tags allowed"),
      publisher: Joi.number().optional(),
      quantity: Joi.number().min(0).optional(),
      coverImage: Joi.string().optional().regex(/^[^<>]*$/, "no HTML tags allowed"),
      status: Joi.string()
        .optional()
        .valid(...Object.values(BookStatusEnum)),
      limit: Joi.number().min(1).optional(),
      offset: Joi.number().min(0).optional(),
      order: Joi.array().items(Joi.array().items(Joi.string())).optional(),
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
      returnDate: Joi.date().greater("now").required(),
    },
  },
};
