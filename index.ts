import fs from 'fs/promises';
import BinPacking from './binPacking';
import { createCanvas } from 'canvas';
const binPackingFolder:string = "./binpacking2d/";

(async ()=>{
    const binPacking = await fs.readdir(binPackingFolder)
    .then(files => fs.readFile(binPackingFolder + files[0], 'utf-8'))
    .then(BinPacking.fromString)

    // .then(files => files.map(file => fs.readFile(binPackingFolder + file, 'utf-8')))
    // .then(promises => Promise.all(promises))
    // .then(binPackingStrings => binPackingStrings.map(BinPacking.fromString))
    // .then(console.log) 

    binPacking.generateRandomSolution();

    fs.mkdir('./output').catch(()=>{});

    let i = 0;
    for (const bin of binPacking.getBins()) {
        const canvas = createCanvas(bin.width, bin.height)
        const ctx = canvas.getContext('2d')

        bin.getItems().forEach(({item,x,y}) => {
            ctx.fillStyle = `#${Math.floor(Math.random()*16777215).toString(16)}`;
            ctx.fillRect(x, y, item.width, item.height);
        });

        const buffer = canvas.toBuffer('image/png')
        await fs.writeFile(`./output/bin${i++}.png`, buffer)
    }


})()
