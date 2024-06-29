import { App } from './app';
import cluster from 'cluster';
import { PORT } from './common/configs/configs';

const app = App.getInstance();
const port = PORT;

const clusterWorkerSize = 1;

if (clusterWorkerSize > 1) {
    if (cluster.isPrimary) {
        // iterate on number of available cores need to be utilized by an application
        for (let i = 0; i < clusterWorkerSize; i++) {
            cluster.fork();
        }

        // if any of the worker process dies then start a new one by simply forking another one
        cluster.on("exit", (worker: any, code: any, signal: any) => {
            console.info("%o => Worker %o died with code: %o, and signal: %o", worker.id, worker.process.pid, code, signal);
            cluster.fork();
        });
    } else {
        app.initServer(port);
    }
} else {
    app.initServer(port);
}