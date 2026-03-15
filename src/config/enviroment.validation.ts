import Joi from "joi";

export default Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required().default('development'),
  PORT: Joi.number().port().optional().default(8000),
  MONGO_URI: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  PROFILE_API_KEY: Joi.string().optional(),
  JWT_SECRET: Joi.string().required(),
  JWT_TOKEN_AUDIENCE: Joi.string().required(),
  JWT_TOKEN_ISSUER: Joi.string().required(),
  JWT_TOKEN_TTL: Joi.number().required(),
}); 