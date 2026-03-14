import { registerAs } from '@nestjs/config';

export default registerAs('profileConfig', () => ({
  profileApiKey: parseInt(process.env.PROFILE_API_KEY ?? '3600', 10),
}));
