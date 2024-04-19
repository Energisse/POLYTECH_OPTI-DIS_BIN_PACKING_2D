import fs from 'fs/promises';
import BinPacking from './binPacking';
const binPackingFolder:string = "./binpacking2d/";

(async ()=>{
    const files = await fs.readdir(binPackingFolder)
    .then(files => files.map(file => fs.readFile(binPackingFolder + file, 'utf-8')))
    .then(promises => Promise.all(promises))
    .then(binPackingStrings => binPackingStrings.map(BinPacking.fromString))
    .then(console.log) 
})()
