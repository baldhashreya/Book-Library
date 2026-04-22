import { Joi } from "celebrate";
import { BookStatusEnum } from "common";

export const BooksModel = {
  Create: {
    params: {},
    body: {
      title: Joi.string()
        .trim()
        .required()
        .min(3)
        .max(50)
        .regex(/^[\x20-\x7E]*$/, "only ASCII characters are allowed")
        .regex(/^[^{"$}]*$/, "invalid input detected"),
      author: Joi.string().trim().required().regex(/^[0-9a-fA-F]{24}$/, "invalid author id format"),
      category: Joi.string().trim().required().regex(/^[0-9a-fA-F]{24}$/, "invalid category id format"),
      description: Joi.string()
        .trim()
        .required()
        .regex(/^[\x20-\x7E]*$/, "only ASCII characters are allowed")
        .regex(/^[^{"$}]*$/, "invalid input detected"),
      isbn: Joi.string().required().length(13).pattern(/^\d+$/).message("isbn format invalid"),
      publisher: Joi.number().min(1000).max(2025).integer().required(),
      quantity: Joi.number().min(1).integer().required(),
      coverImage: Joi.string()
        .allow(null, "")
        .trim()
        .regex(/^[\x20-\x7E]*$/, "only ASCII characters are allowed")
        .regex(/^[^{"$}]*$/, "invalid input detected"),
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
      title: Joi.string()
        .trim()
        .required()
        .min(3)
        .max(50)
        .regex(/^[\x20-\x7E]*$/, "only ASCII characters are allowed")
        .regex(/^[^{"$}]*$/, "invalid input detected"),
      author: Joi.string().trim().required().regex(/^[0-9a-fA-F]{24}$/, "invalid author id format"),
      category: Joi.string().trim().required().regex(/^[0-9a-fA-F]{24}$/, "invalid category id format"),
      description: Joi.string()
        .trim()
        .required()
        .regex(/^[\x20-\x7E]*$/, "only ASCII characters are allowed")
        .regex(/^[^{"$}]*$/, "invalid input detected"),
      isbn: Joi.string().required().length(13).pattern(/^\d+$/).message("isbn format invalid"),
      publisher: Joi.number().required().min(1000).max(2025).integer(),
      quantity: Joi.number().required().min(1).integer(),
      coverImage: Joi.string()
        .allow(null, "")
        .regex(/^[\x20-\x7E]*$/, "only ASCII characters are allowed")
        .regex(/^[^{"$}]*$/, "invalid input detected"),
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
      quantity: Joi.number().min(1).optional(),
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
