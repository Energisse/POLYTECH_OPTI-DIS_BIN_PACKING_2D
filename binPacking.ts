import Item from "./Item";
import Bin from "./bin";

export default class BinPacking{

    private name: string;

    private comment: string;

    private nbItems: number;

    private binWidth: number;

    private binHeight: number;

    private items: Array<Item>;

    private bins: Array<Bin> = [];
    
    constructor(name: string, comment: string, nbItems: number, binWidth: number, binHeight: number, items: Array<Item>) {
        this.name = name;
        this.comment = comment;
        this.nbItems = nbItems;
        this.binWidth = binWidth;
        this.binHeight = binHeight;
        this.items = items;
    }

    static fromString(str: string): BinPacking{
        const [name, comment, nbItems, binWidth, binHeight,_,__,...stringItems] = str.replace(/[^:|\n]*: /g,"").split("\n")
        const items = stringItems.map(Item.fromString);
        if(items.length != +nbItems) throw new Error("Number of items does not match");
        return new BinPacking(name, comment, +nbItems, +binWidth, +binHeight,items);
    }

    /**
     * Get the minimum number of bins needed to store all items
     * @returns the minimum number of bins needed
     */
    getMinBinAmount(): number{
        return Math.ceil(this.items.reduce((acc, item) => acc + item.area, 0)/(this.binWidth * this.binHeight));
    }

    generateRandomSolution(): void{
        this.bins = [];
        let rest = [...this.items];
        rest.sort((a,b)=> b.area - a.area)
        while(rest.length > 0){
            const bin = new Bin(this.binWidth, this.binHeight);
            this.bins.push(bin);
            rest = rest.filter(item => !bin.addItem(item));
        }
    }

    getBins(): Array<Bin>{
        return this.bins;
    }

    
    generateNeighbor(){
        
    }
}