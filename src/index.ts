import fs from 'fs/promises';
import DataSet from './dataSet';
import Genetique from './genetique';
import BinPacking from './binPacking';
import Draw from './draw';
import tabou from './tabou';
const binPackingFolder:string = "./binpacking2d/";

const workers = new Set<Worker>();

(async ()=>{
    const dataSet = await fs.readdir(binPackingFolder)
    .then(files=>files.map(file => new DataSet(binPackingFolder + file)))
    // .then(dataSets => Promise.all(dataSets.map(dataSet => dataSet.createBinPacking())))
    // const binPacking = binPackings[12];
    // .then(files => files.map(file => fs.readFile(binPackingFolder + file, 'utf-8')))
    // .then(promises => Promise.all(promises))
    // .then(binPackingStrings => binPackingStrings.map(BinPacking.fromString))
    // .then(console.log) 
    
    // order item in this order 4 1 5 2 7 6 9 10 3 8
    // dataSet[0].getItems().sort((a,b)=> {
    //     // const order = [4,1,5,2,7,6,9,10,3,8];
    //     // const order = [4,1,5,8,2,7,6,9,10,3];
    //     const order = [8,2,7,6,9,10,3,4,1,5];
    //     return order.indexOf(a.getId()) - order.indexOf(b.getId());
    // })

    // const toRotate = [11]
    // dataSet[0].getItems().forEach(item => {
    //     if(toRotate.includes(item.getId())){
    //         item.rotate();
    //     }
    // })

    // const toRemove =[6,9,10,3]
    // const data = dataSet[0].getItems().filter(item => !toRemove.includes(item.getId()))

    // console.log(data.map(item => item.getId()));

    await new tabou(dataSet[11]).run();

    // Draw.drawBinPackingToFiles(new BinPacking(dataSet[0].binWidth, dataSet[0].binHeight, data), './output');
    // await fs.mkdir(`./output/`).catch(()=>{});
    // const data = dataSet[11]
    // // for(const data of dataSet){
    //     await fs.mkdir(`./output/${data.name}`).catch(()=>{});
    //     const genetique = new Genetique(data)
    //     genetique.generatePopulation();
    //     await fs.mkdir(`./output/${data.name}/INIT/`).catch(()=>{});
    //     await genetique.draw(`./output/${data.name}/INIT/`);
    //     for(let i = 0; i <= 100_000; i++){
    //         genetique.computeFitness();
    //         genetique.crossover();
    //         genetique.mutate();
    //         console.log("Generation: " + i);
    //         if(i%10000 == 0){
    //             await fs.mkdir(`./output/${data.name}/gen${i}`).catch(()=>{});
    //             await genetique.draw(`./output/${data.name}/gen${i}`);
    //         }
    //     }
    // }

    // binPacking.generateRandomSolution();

    // await fs.rm('./output', { recursive: true }).catch(()=>{});
    // await fs.mkdir('./output').catch(()=>{});

    // let i = 0;
    // Draw.drawBinPackingToFiles(binPacking, './output');
    // const start = performance.now();
    // const oui = binPacking.generateNeighbor();
    // const end = performance.now();
    // console.log("Time to generate neighbor: " + (end - start) + "ms");

    // let iteration = 0
    // i = 0;
    //    for(const binPacking of oui){
    //     iteration++;
    //     fs.mkdir('./output/iter'+iteration).catch(()=>{});
    //     Draw.drawBinPackingToFiles(binPacking, './output/iter'+iteration);
    //    }
})()
