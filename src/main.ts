import fs from 'fs';
import DataSet from './dataSet';
import { Worker } from 'worker_threads';
import { WorkerData } from './worker';
import Genetique from './metaheuristique/genetique';
import Tabou from './metaheuristique/tabou';
import Draw from './draw';
import HillClimbing from './metaheuristique/hillClimbing';
import RecuitSimule from './metaheuristique/recuitSimule';
import chalk from 'chalk';
const binPackingFolder: string = "./binpacking2d/";

const folders = fs.readdirSync(binPackingFolder)
const dataSet = folders.map(file => new DataSet(fs.readFileSync(binPackingFolder + file, "utf8")));

function createWorker(data: string, type: "genetique" | "tabou") {
    return new Worker(require.resolve(`./worker`), {
        execArgv: ['-r', 'ts-node/register/transpile-only'],
        workerData: {
            data: data,
            type
        } satisfies WorkerData
    });
}


function waitWorkerReady(worker: Worker) {
    return new Promise((resolve) => {
        worker.on('message', (message) => {
            if (message == "ready") {
                resolve("");
            }
        });
    });
}

function waitWorkerToFinish(worker: Worker) {
    return new Promise((resolve) => worker.on('exit', resolve));
}

/*(async () => {
    const workers = [createWorker(dataSet[11],"genetique"),createWorker(dataSet[11],"tabou")];
    await Promise.all(workers.map(worker => waitWorkerReady(worker)));
    workers.forEach(worker => worker.postMessage(""));
    const results = [
        {fitness:0,i:0},
        {fitness:0,i:0}
    ]
    const start = performance.now();
    let temps = ""
    let iteration = ""
    workers.forEach((worker,index) => {
        worker.on('message', (message) => {
            results[index] = message;
            const end = performance.now() - start;
            console.log(end+";"+results[0].fitness+";"+results[1].fitness);
            temps += end+";"+results[0].fitness+";"+results[1].fitness + "\n";
            console.log(end+";"+results[0].i+";"+results[1].i);
            iteration += end+";"+results[0].i+";"+results[1].i + "\n";
        });
    });
   

    await Promise.all(workers.map(worker => waitWorkerToFinish(worker)));
    console.log(iteration);
    fs.writeFileSync("temps.txt",temps.replace(/\./g,","),"utf8");
    fs.writeFileSync("iteration.txt",iteration.replace(/\./g,","),"utf8");
})()*/

try {
    fs.rmSync('./output', { recursive: true })
}
catch (e) {
    console.log(e);
}

//Desactivation de la convergence
const convergence = 0

const gobalStart = performance.now();
for (const data of dataSet) {
    const startDataSet = performance.now();
    console.log(chalk.greenBright.underline(`Starting ${data.name}`));
    const algos = [new Genetique(data, { convergence }), new Tabou(data, { convergence }), new HillClimbing(data, { convergence }), new RecuitSimule(data, { convergence })];
    for (const algo of algos) {
        console.log(chalk.blueBright.underline(`\t${algo.constructor.name}`));
        const start = performance.now();
        let lastIteration = 0;
        for (const { iteration, solution } of algo) {
            if (iteration % data.nbItems == 0 || iteration == 1) Draw.drawBinPackingToFilesSync(solution[0], `./output/${algo.constructor.name.toLowerCase()}/${data.name}/${iteration}`);
            lastIteration = iteration;
        }
        console.log(chalk(`\tResolved with ${algo.numberOfBins} bins (fitness: ${algo.fitness}) under ${lastIteration} iterations`));
        console.log(chalk(`\tdone in ${Math.floor(performance.now() - start)}ms \n`));
    }
    console.log(chalk.whiteBright.bgGreenBright(`${data.name} done in ${Math.floor(performance.now() - startDataSet)}ms\n`));
}
console.log(chalk.blue.underline(`All done in ${Math.floor(performance.now() - gobalStart)}ms`));