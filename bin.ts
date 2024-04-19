import Item from "./Item";
import Rectangle from "./rectangle";

export default class Bin extends Rectangle{

    private item: Item | null = null;

    private subBins : Array<Bin> = [];

    private x: number;

    private y: number;

    constructor(width:number, height:number, x: number = 0, y: number = 0){
        super(width, height);
        this.x = x;
        this.y = y;
    }

    /**
     * Add an item to the bin
     * @param item the item to add
     */
    addItem(item:Item): boolean{
        if(item.width > this.width || item.height > this.height) return false;

        if(this.item == null){
            this.item = item;
            /** 3 BINS */
            // if(this.width+this.item.width > 0){
            //     this.subBins.push(new Bin(this.width-this.item.width, this.item.height, this.x + this.item.width, this.y));
            // }
            // if(this.height+this.item.height > 0){
            //     this.subBins.push(new Bin(this.item.width, this.height-this.item.height, this.x, this.y + this.item.height));
            // }
            // if( this.width+item.width > 0 && this.height+item.height > 0){
            //     this.subBins.push(new Bin(this.width-this.item.width, this.height-this.item.height,this.x + this.item.width,this.y +  this.item.height));
            // }

            if(this.width+this.item.width > 0){
                this.subBins.push(new Bin(this.width-this.item.width, this.height, this.x + this.item.width, this.y));
            }
            if(this.height+this.item.height > 0){
                this.subBins.push(new Bin(this.item.width, this.height-this.item.height, this.x, this.y + this.item.height));
            }
            return true;
        }

        for(const bin of this.subBins){
            if(bin.addItem(item)) return true;
        }

        return false;
    }

    getItem(): Item | null
    {
        return this.item
    }

    getSubBins(): Array<Bin>{
        return this.subBins;
    }

    getX(): number{
        return this.x;
    }

    getY(): number{
        return this.y;
    }
}