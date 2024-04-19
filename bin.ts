import Item from "./Item";
import Rectangle from "./rectangle";

export default class Bin extends Rectangle{

    private items: Array<{
        item: Item,
        x: number,
        y: number
    }> = [];

    /**
     * Add an item to the bin
     * @param item the item to add
     */
    addItem(item:Item): boolean{
        if(item.width > this.width || item.height > this.height) return false;

        const x = this.items.reduce((acc, {item,x}) => acc < item.width+x ? item.width+x : acc, 0);
        if(x + item.width > this.width) return false;

        this.items.push({
            item,
            x,
            y:0
        });

        return true;
    }

    get remainingArea(): number{
        return this.area - this.items.reduce((acc, {item}) => acc + item.area, 0);
    }

    getItems(): Array<{
        item: Item,
        x: number,
        y: number
    }>{
        return this.items
    }
}