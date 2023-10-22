import * as Joi from 'joi';

export function validateSchema() {
  return Joi.object({
    NODE_ENV: Joi.string().valid('local', 'dev', 'qa', 'prod', 'test').default('dev'),
    PORT: Joi.number().required(),
  });
}
