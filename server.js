import cluster from 'cluster';
import os from 'os';
import { startServer } from './app.js';

const numCPUs = os.cpus().length;

if (cluster.isPrimary || cluster.isMaster) {
  console.log(`🧠 Master ${process.pid} is running`);
  console.log(`🔁 Forking ${numCPUs} workers...`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`⚠️ Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  startServer();
}
