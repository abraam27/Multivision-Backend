import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  mongoDB: {
    mongoUri: process.env.MONGO_URI ?? '',
    mongoDbName: process.env.DB_NAME ?? 'multivision-demo',
  },
}));
