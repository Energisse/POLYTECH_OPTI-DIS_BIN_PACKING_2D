import Rectangle from "./rectangle";

export default class Item extends Rectangle{

    readonly id: number;

    constructor(id: number, width: number, height: number) {
        super(width,height);
        this.id = id;
    }

    rotate(): void{
        [this.width, this.height] = [this.height, this.width];
    }

    copy(): Item{
        return new Item(this.id, this.width, this.height);
    }
}