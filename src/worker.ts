import { workerData,parentPort, } from "worker_threads";
import Metaheuristique from "./metaheuristique/metaheuristique";
import Genetique from "./metaheuristique/genetique";
import DataSet from "./dataSet";
import Tabou from "./metaheuristique/tabou";

export interface WorkerData {
    data: string;
    type:"genetique"|"tabou";
}

const data = workerData as WorkerData;

const Algo = data.type == "genetique" ? Genetique : Tabou;

const metaheuristique:Metaheuristique = new Algo(new DataSet(data.data));

parentPort?.once('message', async () => {
    for(const {solution,iteration} of metaheuristique){
        parentPort?.postMessage({fitness:solution[0].fitness,i:iteration});
    }
})

parentPort?.postMessage("ready");
