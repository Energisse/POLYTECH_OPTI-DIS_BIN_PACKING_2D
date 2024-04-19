export default class Item{
    
        private id: number;
    
        private width: number;
    
        private height: number;
    
        constructor(id: number, width: number, height: number) {
            this.id = id;
            this.width = width;
            this.height = height;
        }

        static fromString(str: string): Item{
            const [id, width, height] = str.split(" ").map(Number);
            return new Item(id, width, height);
        }

        get area(): number{
            return this.width * this.height;
        }
    }