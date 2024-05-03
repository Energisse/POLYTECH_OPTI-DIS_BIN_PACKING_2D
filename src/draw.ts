import { createCanvas } from 'canvas';
import Bin from './bin';
import fs from 'fs';
import BinPacking from './binPacking';
import path from 'path';

export default class Draw{

    private static getColor(id:number, max:number):string{
        const hue = (id/max) * 300 ; //red is 0 and 360, green is 120, blue is 240, purple is 300
        return `hsl(${hue},100%,${(id%3+1)*25}%)`;
    }

    private constructor(){}

    static drawBinPackingToFilesSync(binPacking: BinPacking,name:string,type: 'pdf'|'svg' = "svg"):void{
        for(let i = 0; i < binPacking.bins.length; i++){
            this.writeFileRecursiveSync(name+"/bin"+i+".svg", this.drawBin(binPacking,binPacking.bins[i],type));
        };
    }

    static async drawBinPackingToFiles(binPacking: BinPacking,name:string,type: 'pdf'|'svg' = "svg"):Promise<void>{
        for(let i = 0; i < binPacking.bins.length; i++){
            await this.writeFileRecursive(name+"/bin"+i+".svg", this.drawBin(binPacking,binPacking.bins[i],type));
        };
    }


    private static drawBin(binPacking:BinPacking,bin: Bin,type: 'pdf'|'svg' = "svg"){
        const canvas = createCanvas(bin.width, bin.height,type)
        const ctx = canvas.getContext('2d');
        function drawRec(bin: Bin){
            ctx.strokeStyle = `red`;
            ctx.rect( bin.x,bin.y, bin.width, bin.height);
            ctx.stroke();
            const item = bin.item
            if(item != null){
                ctx.fillStyle = Draw.getColor(item.id,binPacking.items.length);
                ctx.fillRect( bin.x,bin.y, item.width, item.height);
                ctx.font="20px Georgia";
                ctx.textAlign="center"; 
                ctx.textBaseline = "middle";
                ctx.fillStyle = "#000000";
                ctx.fillText(item.id.toString(),bin.x+(item.width/2),bin.y+(item.height/2));
            }
            for(const subBin of bin.subBins){
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