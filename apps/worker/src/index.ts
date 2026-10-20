import PgBoss from 'pg-boss';
import { env } from './env.js';

const boss = new PgBoss({
  connectionString: env.DATABASE_URL,
  application_name: 'portal-worker',
});

async function start() {
  await boss.start();
  console.log('pg-boss started');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (boss as any).subscribe('heartbeat', async () => {
    console.log(`[${new Date().toISOString()}] Heartbeat job executed`);
  });

  await boss.schedule('heartbeat', '*/5 * * * *', {});

  console.log('Heartbeat job scheduled every 5 minutes');
}

async function gracefulShutdown() {
  console.log('Shutting down gracefully...');
  await boss.stop();
  process.exit(0);
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

start().catch((error) => {
  console.error('Failed to start worker:', error);
  process.exit(1);
});
