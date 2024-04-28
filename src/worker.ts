import { workerData,parentPort, } from "worker_threads";
import Metaheuristique from "./metaheuristique/metaheuristique";
import Genetique from "./metaheuristique/genetique";
import DataSet from "./dataSet";
import Tabou from "./metaheuristique/tabou";

export interface WorkerData {
    fileName: string;
    type:"genetique"|"tabou";
}

const data = workerData as WorkerData;

const Algo = data.type == "genetique" ? Genetique : Tabou;

const metaheuristique:Metaheuristique = new Algo(new DataSet(data.fileName));

metaheuristique.on('newSolution', async (solution,i) => {
    parentPort?.postMessage({fitness:solution[0].getFitness(),i});
})  

parentPort?.once('message', async () => {
    metaheuristique.run();
})

parentPort?.postMessage("ready");
