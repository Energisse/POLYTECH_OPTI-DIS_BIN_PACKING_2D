import Item from "./Item";
import Rectangle from "./rectangle";

export default class Bin extends Rectangle{

    private item: Item | null = null;

    private bottomSubBin : Bin | null = null;
    private rightSubBin : Bin | null = null;

    private divided: boolean = false;

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
        if(item.area > this.area - (this.item?.area || 0)) return false;

        if(this.item == null){
            this.item = item;
            return true;
        } 

        if(this.rightSubBin==null)
            this.rightSubBin = new Bin(this.width-this.item.width, this.height, this.x+this.item.width, this.y);
    
        if(this.bottomSubBin==null)
            this.bottomSubBin = new Bin(this.item.width, this.height-this.item.height, this.x, this.y + this.item.height);

        if(this.rightSubBin.addItem(item)) return true;
        if(this.bottomSubBin.addItem(item)) return true;

        if(!this.rightSubBin || this.rightSubBin.isEmtpy() ){
            let newBottomBin = new Bin(this.width, this.height-this.item.height, this.x, this.y+this.item.height);
            for(const item of this.bottomSubBin.getItems()){
                if(!newBottomBin.addItem(item)){
                    return false;
                }
            }
            if(newBottomBin.addItem(item)){
                this.bottomSubBin = newBottomBin;
                this.rightSubBin = new Bin(this.width-this.item.width, this.item.height, this.x+this.item.width, this.y);
                return true;
            }
        }

        return false;
    }

    getItem(): Item | null
    {
        return this.item
    }

    getItems(): Array<Item>
    {
        let items: Array<Item> = [];
        if(this.item != null){
            items.push(this.item);
        }
        this.rightSubBin?.getItems().forEach(item => items.push(item));
        this.bottomSubBin?.getItems().forEach(item => items.push(item));

        return items;
    }

    getSubBins(): Array<Bin>{
        return [this.rightSubBin, this.bottomSubBin].filter(bin => bin != null) as Bin[];
    }

    removeItem(item:Item): void{
        if(this.item?.getId() == item.getId()){
            this.item = null;
        }else{
            this.rightSubBin?.removeItem(item);
            this.bottomSubBin?.removeItem(item);
        }
    }

    getX(): number{
        return this.x;
    }

    getY(): number{
        return this.y;
    }

    copy(): Bin{
        const bin = new Bin(this.width, this.height, this.x, this.y);
        bin.item = this.item?.copy() || null;
        bin.divided = this.divided;
        bin.bottomSubBin = this.bottomSubBin?.copy() || null;
        bin.rightSubBin = this.rightSubBin?.copy() || null;
        return bin;
    }

    isEmtpy(): boolean{
        if(this.item != null) return false;
        if(this.rightSubBin != null && !this.rightSubBin.isEmtpy()) return false;
        if(this.bottomSubBin != null && !this.bottomSubBin.isEmtpy()) return false;
        return true;
    }
}