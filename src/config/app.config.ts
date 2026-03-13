import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  env: process.env.NODE_ENV ?? 'develop',
  port: parseInt(process.env.PORT ?? '8000', 10),
}));
