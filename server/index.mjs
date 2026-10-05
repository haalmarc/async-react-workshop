import { createApiServer } from './api.mjs';

const server = createApiServer();
server.listen(3001, '127.0.0.1', () => console.log('Workshop-API: http://127.0.0.1:3001'));
server.on('error', (error) => {
  console.error(error);
  process.exitCode = 1;
});
process.on('SIGTERM', () => server.close());
process.on('SIGINT', () => server.close());
