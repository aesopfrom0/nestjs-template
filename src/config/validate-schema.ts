import { Environment } from '@/common/constant/environment';
import Joi from 'joi';

/*
  디폴트 값은 아래 스키마에서 지정하기 보다는
  configuration.ts에서 지정하는 것을 권장
*/
export function validateSchema() {
  return Joi.object({
    NODE_ENV: Joi.string().valid(...Object.values(Environment)),
    PORT: Joi.number().required(),
    ALLOWED_CORS_ORIGIN: Joi.string(),
  });
}
