import dotenv from 'dotenv';

if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'test') {
  dotenv.config({
    path: `${__dirname}/../.env`,
  });
}
