import BinPacking from "../binPacking";
import DataSet from "../dataSet";
import {  TypedEmitter }  from "tiny-typed-emitter";

export interface MetaheuristiqueEvents  {
    bestSolution: (solution: BinPacking) => void;
    newSolution: (solution: BinPacking[] , iteration: number) => void;
}

abstract class Metaheuristique extends TypedEmitter<MetaheuristiqueEvents>   {
    private _dataSet: DataSet;

    constructor(dataSet: DataSet){
        super();
        this._dataSet = dataSet;
    }

    public abstract run(): void;

    get dataSet(): DataSet{
        return this._dataSet;
    }
}

export default Metaheuristique;