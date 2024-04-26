import { createCanvas,CanvasRenderingContext2D } from 'canvas';
import Bin from './bin';
import fs from 'fs/promises';
import BinPacking from './binPacking';

export default class Draw{

    private constructor(){}

    static async drawBinPackingToFiles(binPacking: BinPacking,name:string):Promise<void>{
        for(let i = 0; i < binPacking.getBins().length; i++){
            const bin = binPacking.getBins()[i];
            const canvas = createCanvas(bin.width, bin.height)
            const ctx = canvas.getContext('2d');
            this.drawBin(bin,ctx);
            const buffer = canvas.toBuffer('image/png')
            await fs.mkdir(name).catch(()=>{});
            await fs.writeFile(name+"/bin"+i+".png", buffer)
        };
    }

    private static drawBin(bin: Bin,ctx:CanvasRenderingContext2D){
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
            this.drawBin(subBin,ctx);
        }
    }
}