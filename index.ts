import fs from 'fs/promises';
import BinPacking from './binPacking';
import { createCanvas } from 'canvas';
import Bin from './bin';
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
        function drawBin(bin: Bin){
            ctx.strokeStyle = `red`;
            ctx.rect( bin.getX(),bin.getY(), bin.width, bin.height);
            ctx.stroke();
            const item = bin.getItem()
            if(item != null){
                ctx.fillStyle = `#${Math.floor(Math.random()*16777215).toString(16)}`;
                ctx.fillRect( bin.getX(),bin.getY(), item.width, item.height);
                bin.getSubBins().forEach(drawBin)
            }
        }

        drawBin(bin);

        const buffer = canvas.toBuffer('image/png')
        await fs.writeFile(`./output/bin${i++}.png`, buffer)
    }


})()
