import fs from 'fs/promises';
import BinPacking from './binPacking';
import Draw from './draw';
const binPackingFolder:string = "./binpacking2d/";

(async ()=>{
    const binPacking = await fs.readdir(binPackingFolder)
    .then(files => fs.readFile(binPackingFolder + files[12], 'utf-8'))
    .then(BinPacking.fromString)

    // .then(files => files.map(file => fs.readFile(binPackingFolder + file, 'utf-8')))
    // .then(promises => Promise.all(promises))
    // .then(binPackingStrings => binPackingStrings.map(BinPacking.fromString))
    // .then(console.log) 

    binPacking.generateRandomSolution();

    await fs.rm('./output', { recursive: true }).catch(()=>{});
    await fs.mkdir('./output').catch(()=>{});

    let i = 0;
    for (const bin of binPacking.getBins()) {
        new Draw(bin).toFile(`./output/bin${i++}.png`)
    }
    const start = performance.now();
    const oui = binPacking.generateNeighbor();
    const end = performance.now();
    console.log("Time to generate neighbor: " + (end - start) + "ms");

    let iteration = 0
    i = 0;
       for(const binPacking of oui){
        iteration++;
        fs.mkdir('./output/iter'+iteration).catch(()=>{});
        for (const bin of binPacking) {
            new Draw(bin).toFile(`./output/iter${iteration}/bin${i++}.png`)
        }
       }
})()
