import Item from "./Item";
import Bin from "./bin";
export default class BinPacking{

    private binWidth: number;

    private binHeight: number;

    private bins: Array<Bin> = [];
    
    constructor(binWidth: number, binHeight: number, items: Array<Item>) {
        this.binWidth = binWidth;
        this.binHeight = binHeight;
        
        this.bins = [new Bin(binWidth, binHeight)];
        items.forEach(item => {
            if(this.bins.at(-1)!.addItem(item)){
                return;
            }
            const bin = new Bin(binWidth, binHeight);
            bin.addItem(item);
            this.bins.push(bin);
        })
    }    

    getBins(): Array<Bin>{
        return this.bins;
    }
    
    generateNeighbor():Array<Array<Bin>>{
        const neightbor = []

        for(let binIndiceSource = 0; binIndiceSource < this.bins.length; binIndiceSource++){
            for(let binIndiceOutput = 0; binIndiceOutput < this.bins.length; binIndiceOutput++){
                if(binIndiceSource == binIndiceOutput) continue;
                const items = this.bins[binIndiceSource].getItems();
                for(let itemIndice = 0; itemIndice < items.length; itemIndice++){
                    const bins = [];
                    let valid = false;
                    for(let k = 0; k < this.bins.length; k++){
                        if(k == binIndiceSource){
                            const bin = new Bin(this.bins[k].width, this.bins[k].height);
                            for(let i = 0; i < this.bins[k].getItems().length; i++){
                                if(i != itemIndice)bin.addItem(this.bins[k].getItems()[i].copy());
                            }
                            bins.push(bin);
                        }
                        else bins.push(this.bins[k].copy());
                    }
                    bins[binIndiceSource].removeItem(items[itemIndice]);
                    const copy = items[itemIndice].copy()
                    copy.rotate()
                    valid = bins[binIndiceOutput].addItem(copy) || false;

                    if(valid){
                        neightbor.push(bins);
                    }
                }
            }
        }
        return neightbor;
    }

    getItems(): Array<Item>{
        return this.bins.reduce((acc, bin) => acc.concat(bin.getItems()), [] as Array<Item>);
    }

    getWidth(): number{
        return this.binWidth;
    }

    getHeight(): number{
        return this.binHeight;
    }

    getFitness(): number{
        return this.bins.reduce((acc, bin) => acc + Math.pow(bin.getItems().reduce((acc, item) => acc + item.area, 0), 2), 0);
    }
}