export default () => ({
  environment: process.env.NODE_ENV,
  port: +process.env.PORT,
  allowedCorsOrigins: process.env.ALLOWED_CORS_ORIGIN?.split(',') || [],
});
