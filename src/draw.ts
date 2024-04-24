import { createCanvas,Canvas,CanvasRenderingContext2D } from 'canvas';
import Bin from './bin';
import fs from 'fs/promises';

export default class Draw{

    private canvas: Canvas;
    private ctx: CanvasRenderingContext2D;

    constructor(bin:Bin){
        this.canvas = createCanvas(bin.width, bin.height)
        this.ctx = this.canvas.getContext('2d');
        this.drawBin(bin);
    }

    drawBin(bin: Bin){
        this.ctx.strokeStyle = `red`;
        this.ctx.rect( bin.getX(),bin.getY(), bin.width, bin.height);
        this.ctx.stroke();
        const item = bin.getItem()
        if(item != null){
            this.ctx.fillStyle = item.getColor();
            this.ctx.fillRect( bin.getX(),bin.getY(), item.width, item.height);
            this.ctx.font="20px Georgia";
            this.ctx.textAlign="center"; 
            this.ctx.textBaseline = "middle";
            this.ctx.fillStyle = "#000000";
            this.ctx.fillText(item.getId().toString(),bin.getX()+(item.width/2),bin.getY()+(item.height/2));
        }
        for(const subBin of bin.getSubBins()){
            this.drawBin(subBin);
        }
    }

    toFile(name:string){
        const buffer = this.canvas.toBuffer('image/png')
        return fs.writeFile(name, buffer)
    }
}