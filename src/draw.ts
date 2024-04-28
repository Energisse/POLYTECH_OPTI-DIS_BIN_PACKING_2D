import { createCanvas } from 'canvas';
import Bin from './bin';
import fs from 'fs';
import BinPacking from './binPacking';
import path from 'path';

export default class Draw{

    private constructor(){}

    static drawBinPackingToFilesSync(binPacking: BinPacking,name:string):void{
        for(let i = 0; i < binPacking.getBins().length; i++){
            this.writeFileRecursiveSync(name+"/bin"+i+".png", this.drawBin(binPacking.getBins()[i]));
        };
    }

    static async drawBinPackingToFiles(binPacking: BinPacking,name:string):Promise<void>{
        for(let i = 0; i < binPacking.getBins().length; i++){
            await this.writeFileRecursive(name+"/bin"+i+".png", this.drawBin(binPacking.getBins()[i]));
        };
    }


    private static drawBin(bin: Bin){
        const canvas = createCanvas(bin.width, bin.height)
        const ctx = canvas.getContext('2d');
        function drawRec(bin: Bin){
            ctx.strokeStyle = `red`;
            ctx.rect( bin.getX(),bin.getY(), bin.width, bin.height);
            ctx.stroke();
            const item = bin.getItem()
            if(item != null){
                ctx.fillStyle = item.getColor();
                ctx.fillRect( bin.getX(),bin.getY(), item.width, item.height);
                ctx.font="20px Georgia";
                ctx.textAlign="center"; 
                ctx.textBaseline = "middle";
                ctx.fillStyle = "#000000";
                ctx.fillText(item.getId().toString(),bin.getX()+(item.width/2),bin.getY()+(item.height/2));
            }
            for(const subBin of bin.getSubBins()){
                drawRec(subBin);
            }
        }
        drawRec(bin);
        return canvas.toBuffer();
    }

    private static writeFileRecursive(filename: string, data: Buffer): Promise<void> {
        const folder = filename.split(/\\|\//).slice(0, -1).join(path.sep)
        if (!fs.existsSync(folder)) fs.mkdirSync(folder,{recursive:true})
        return fs.promises.writeFile(filename, data)
    }

    private static writeFileRecursiveSync(filename: string, data: Buffer): void {
        const folder = filename.split(/\\|\//).slice(0, -1).join(path.sep)
        if (!fs.existsSync(folder)) fs.mkdirSync(folder,{recursive:true})
        fs.writeFileSync(filename, data)
    }
}