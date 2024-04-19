import Rectangle from "./rectangle";

export default class Item extends Rectangle{

    private id: number;

    constructor(id: number, width: number, height: number) {
        super(width,height);
        this.id = id;
    }

    static fromString(str: string): Item{
        const [id, width, height] = str.split(" ").map(Number);
        return new Item(id, width, height);
    }
}