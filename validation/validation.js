const Joi = require("joi");
const postSchema = Joi.object({
  name: Joi.string().min(1).required(),
  status: Joi.number().valid(0, 1).required(),
  edition_link: Joi.string().uri().required(),
  published_at: Joi.date().iso(),
  thumbnail: Joi.string().uri().required(),
});


const putSchema = Joi.object({
  name: Joi.string().min(1),
  status: Joi.number().valid(0, 1),
  edition_link: Joi.string().uri(),
  thumbnail: Joi.string().uri(),
  published_at: Joi.date().iso(),
});

const validator = (schema) => (payload) => schema.validate(payload, { abortEarly: false });

exports.validatePost = validator(postSchema);
exports.validatePut = validator(postSchema);
