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

const gen = metaheuristique.run();

let value = gen.next();

parentPort?.once('message', async () => {
    while(value.done == false){
        const {solution,iteration} = value.value;
        parentPort?.postMessage({fitness:solution[0].fitness,i:iteration});
        value = gen.next();
    }
})

parentPort?.postMessage("ready");
