import BinPacking from "../binPacking";
import DataSet from "../dataSet";

abstract class Metaheuristique   {
    private _dataSet: DataSet;

    constructor(dataSet: DataSet){
        this._dataSet = dataSet;
    }

    public abstract run(): Generator<{
        solution: BinPacking[];
        iteration: number;
    }, void, void>;


    get dataSet(): DataSet{
        return this._dataSet;
    }
}

export default Metaheuristique;