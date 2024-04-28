import fs from 'fs';
import DataSet from './dataSet';
import { Worker } from 'worker_threads';
import { WorkerData } from './worker';
import Metaheuristique from './metaheuristique/metaheuristique';
import Genetique from './metaheuristique/genetique';
import Tabou from './metaheuristique/tabou';
import Draw from './draw';
const binPackingFolder:string = "./binpacking2d/";

const folders = fs.readdirSync(binPackingFolder)
const dataSet = folders.map(folder => new DataSet(binPackingFolder + folder));

function createWorker(dataSet:DataSet,type:"genetique"|"tabou"){
    return new Worker(require.resolve(`./worker`), { execArgv:['-r', 'ts-node/register/transpile-only'],
    workerData:{
        fileName:dataSet.file,
        type
    } satisfies WorkerData
    });  
}


function waitWorkerReady(worker:Worker){
    return new Promise((resolve) => {
        worker.on('message', (message) => {
            if(message == "ready"){
                resolve("");
            }
        });
    });
}

function waitWorkerToFinish(worker:Worker){
    return new Promise((resolve) => worker.on('exit',resolve));
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
    fs.rmdirSync('./output', { recursive: true })
}
catch(e){
    console.log(e);
}


for(const data of dataSet){
    const algos =  [ new Genetique(data),new Tabou(data)];
    for(const algo of algos){
    
    algo.on('newSolution', async (solution,i) => {
            if(i%(data.nbItems**2/10) == 0 || i == 1){
                if(algo instanceof Tabou ){
                    Draw.drawBinPackingToFilesSync(solution[0], `./output/tabou/${data.name}/${i}`);
                }
                else solution.map((sol,pop)=>Draw.drawBinPackingToFilesSync(sol, `./output/genetique/${data.name}/${i}/pop${pop}`));
            }
        })  
    
    algo.run();
    }
}