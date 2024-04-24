export default class Rectangle{
    width: number;
    height: number;

    constructor(width: number, height: number){
        this.width = width;
        this.height = height;
    }

    get area(): number{
        return this.width * this.height;
    }
}