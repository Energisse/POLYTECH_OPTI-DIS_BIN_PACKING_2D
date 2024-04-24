import Rectangle from "./rectangle";

export default class Item extends Rectangle{

    private id: number;

    private color: string;

    constructor(id: number, width: number, height: number, color?: string) {
        super(width,height);
        this.id = id;
        this.color = color || `#${Math.floor(Math.random()*16777215).toString(16)}`;
    }

    static fromString(str: string): Item{
        const [id, width, height] = str.split(" ").map(Number);
        return new Item(id, width, height);
    }

    rotate(): void{
        [this.width, this.height] = [this.height, this.width];
    }

    getId(): number{
        return this.id;
    }

    copy(): Item{
        return new Item(this.id, this.width, this.height, this.color);
    }

    getColor(): string{
        return this.color;
    }
}