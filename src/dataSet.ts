import Item from "./Item";
import BinPacking from "./binPacking";
import fs from 'fs';

/**
 * Class representing a dataset for the bin packing problem.
 */
export default class DataSet {
    private _name: string;
    private _comment: string;
    private _nbItems: number;
    private _binWidth: number;
    private _binHeight: number;
    private _items: Array<Item>;
    private _file: string;

    /**
     * Creates a new instance of DataSet.
     * @param file Path to the file containing the dataset.
     */
    constructor(file: string) {
        this._file = file;

        // Read file data and initialize class properties
        const data =  fs.readFileSync(file, 'utf-8');
        const [name, comment, nbItems, binWidth, binHeight,_,__,...stringItems] = data.replace(/[^:|\n]*: /g,"").replace(/\r/g,"").split("\n");
        this._name = name;
        this._comment = comment;
        this._nbItems = +nbItems;
        this._binWidth = +binWidth;
        this._binHeight = +binHeight;
        this._items = stringItems.map(item => {
            const [id, width, height] = item.split(" ").map(Number);
            return new Item(id, width, height);
        });
        if(this._items.length != +nbItems) throw new Error("Number of items does not match");
    }

    /**
     * Creates a bin packing from the dataset.
     * @returns The created bin packing.
     */
    createBinPacking():BinPacking{
        return new BinPacking(this._binWidth, this._binHeight,this._items);
    }

    /**
     * Creates a random solution for the bin packing problem.
     * @returns The randomly created solution.
     */
    createRandomSolution(): BinPacking{
        return new BinPacking(this._binWidth, this._binHeight,[...this._items].sort(()=>Math.random()-0.5));
    }

    /**
     * Gets the minimum number of bins needed to store all items.
     * @returns The minimum number of bins needed.
     */
    get minBinAmount(): number{
        return Math.ceil(this._items.reduce((acc, item) => acc + item.area, 0)/(this._binWidth * this._binHeight));
    }

    /**
     * Gets the list of items in the dataset.
     * @returns The list of items.
     */
    get items(): Array<Item>{
        return this._items;
    }
    
    /**
     * Gets the width of the bins in the dataset.
     * @returns The width of the bins.
     */
    get binWidth(): number{
        return this._binWidth;
    }

    /**
     * Gets the height of the bins in the dataset.
     * @returns The height of the bins.
     */
    get binHeight(): number{
        return this._binHeight;
    }

    /**
     * Gets the name of the dataset.
     * @returns The name of the dataset.
     */
    get name(): string{
        return this._name;
    }

    /**
     * Gets the comment of the dataset.
     * @returns The comment of the dataset.
     */
    get comment(): string{
        return this._comment;
    }

    /**
     * Gets the number of items in the dataset.
     * @returns The number of items in the dataset.
     */
    get nbItems(): number{
        return this._nbItems;
    }

    /**
     * Gets the path of the file containing the dataset.
     * @returns The file path.
     */
    get file(): string{
        return this._file;
    }
}