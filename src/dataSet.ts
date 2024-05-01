import Item from "./Item";
import BinPacking from "./binPacking";
import fs from 'fs';

/**
 * Class representing a dataset for the bin packing problem.
 */
export default class DataSet {
    readonly name: string;
    readonly comment: string;
    readonly nbItems: number;
    readonly binWidth: number;
    readonly binHeight: number;
    readonly items: Array<Item>;
    readonly file: string;

    /**
     * Creates a new instance of DataSet.
     * @param file Path to the file containing the dataset.
     */
    constructor(file: string) {
        this.file = file;

        // Read file data and initialize class properties
        const data =  fs.readFileSync(file, 'utf-8');
        const [name, comment, nbItems, binWidth, binHeight,,,...stringItems] = data.replace(/[^:|\n]*: /g,"").replace(/\r/g,"").split("\n");
        this.name = name;
        this.comment = comment;
        this.nbItems = +nbItems;
        this.binWidth = +binWidth;
        this.binHeight = +binHeight;
        this.items = stringItems.map(item => {
            const [id, width, height] = item.split(" ").map(Number);
            return new Item(id, width, height);
        });
        if(this.items.length != +nbItems) throw new Error("Number of items does not match");
    }

    /**
     * Gets the minimum number of bins needed to store all the items.
     * @returns The minimum number of bins needed.
     */
    get minBinAmount(): number{
        return Math.ceil(this.items.reduce((acc, item) => acc + item.area, 0) / (this.binWidth * this.binHeight));
    }

    /**
     * Creates a bin packing from the dataset.
     * @returns The created bin packing.
     */
    createBinPacking():BinPacking{
        return new BinPacking(this.binWidth, this.binHeight,this.items);
    }

    /**
     * Creates a random solution for the bin packing problem.
     * @returns The randomly created solution.
     */
    createRandomSolution(): BinPacking{
        return new BinPacking(this.binWidth, this.binHeight,[...this.items].sort(()=>Math.random()-0.5));
    }
}