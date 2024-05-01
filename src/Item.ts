import Rectangle from "./rectangle";

export default class Item extends Rectangle{

    readonly id: number;

    readonly color: string;

    constructor(id: number, width: number, height: number, color?: string) {
        super(width,height);
        this.id = id;
        this.color = color || `#${Math.floor(Math.random()*16777215).toString(16)}`;
    }

    rotate(): void{
        [this.width, this.height] = [this.height, this.width];
    }

    copy(): Item{
        return new Item(this.id, this.width, this.height, this.color);
    }
}