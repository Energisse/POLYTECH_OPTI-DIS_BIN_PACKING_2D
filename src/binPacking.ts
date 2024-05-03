import Item from "./Item";
import Bin from "./bin";
export default class BinPacking{

    readonly binWidth: number;

    readonly binHeight: number;

    readonly bins: Array<Bin> = [];

    private _items: Array<Item> = [];
    
    constructor(binWidth: number, binHeight: number, items: Array<Item>) {
        this.binWidth = binWidth;
        this.binHeight = binHeight;
        
        this.bins = [new Bin(binWidth, binHeight)];
        items.forEach(item => {
            if(this.bins.at(-1)!.addItem(item)){
                return;
            }
            const bin = new Bin(binWidth, binHeight);
            bin.addItem(item);
            this.bins.push(bin);
        })
        this._items = items;
    }    


    get items(): Array<Item>{
        return this._items;
    }

    get fitness(): number{
        return this.bins.reduce((acc, bin) => acc + Math.pow(bin.fitness, 2), 0);
    }
}