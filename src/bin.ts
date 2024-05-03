import Item from "./Item";
import Rectangle from "./rectangle";

export default class Bin extends Rectangle{

    private _item: Item | null = null;

    private _items : Array<Item> = [];
    private _fitness: number = 0;

    private bottomSubBin : Bin | null = null;
    private rightSubBin : Bin | null = null;

    private divided: boolean = false;

    readonly x: number;

    readonly y: number;

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

        const result = (()=>{
            if(item.width > this.width || item.height > this.height) return false;
            if(item.area > this.area - (this._item?.area || 0)) return false;

            if(this._item == null){
                this._item = item;
                return true;
            } 

            if(this.rightSubBin==null)
                this.rightSubBin = new Bin(this.width-this._item.width, this.height, this.x+this._item.width, this.y);
        
            if(this.bottomSubBin==null)
                this.bottomSubBin = new Bin(this._item.width, this.height-this._item.height, this.x, this.y + this._item.height);

            if(this.rightSubBin.addItem(item)) return true;
            if(this.bottomSubBin.addItem(item)) return true;


            function getDeepestY(bin: Bin): number{
                let max = bin.y + (bin.item?.height || 0);
                for(const subBin of bin.subBins){
                    max = Math.max(max, getDeepestY(subBin));
                }
                return max;
            }

            const newHeight = Math.max(this._item.height, getDeepestY(this.rightSubBin));
            const newBottomBin = new Bin(this.width, this.height-newHeight, this.x, this.y+newHeight);
            for(const item of this.bottomSubBin.items){
                if(!newBottomBin.addItem(item)){
                    return false;
                }
            }
            if(newBottomBin.addItem(item)){
                const newRightBin = new Bin(this.width-this._item.width, newHeight, this.x+this._item.width, this.y);
                for(const item of  this.rightSubBin.items){
                    if(!newRightBin.addItem(item)){
                        return false;
                    }
                }
                this.bottomSubBin = newBottomBin;
                this.rightSubBin = newRightBin;
                return true;
            }

            return false;
        })();
        if(result){
            this._items.push(item);
            this._fitness += item.area;
        }

        return result;
    }

    get item(): Item | null{
        return this._item;
    }

    get fitness(): number{
        return this._fitness;
    }

    get items(): Array<Item>
    {
        return this._items;
    }

    get subBins(): Array<Bin>{
        return [this.rightSubBin, this.bottomSubBin].filter(bin => bin != null) as Bin[];
    }

    copy(): Bin{
        const bin = new Bin(this.width, this.height, this.x, this.y);
        bin._item = this._item?.copy() || null;
        bin.divided = this.divided;
        bin.bottomSubBin = this.bottomSubBin?.copy() || null;
        bin.rightSubBin = this.rightSubBin?.copy() || null;
        return bin;
    }

    isEmtpy(): boolean{
        if(this._item != null) return false;
        if(this.rightSubBin != null && !this.rightSubBin.isEmtpy()) return false;
        if(this.bottomSubBin != null && !this.bottomSubBin.isEmtpy()) return false;
        return true;
    }
}