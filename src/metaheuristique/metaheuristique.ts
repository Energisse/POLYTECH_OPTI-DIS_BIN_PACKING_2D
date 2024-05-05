import BinPacking from "../binPacking";
import DataSet from "../dataSet";

abstract class Metaheuristique<T = any>{
    readonly dataSet: DataSet;
    private _config: Required<T>;
    readonly generator: Generator<{
        solution: BinPacking[];
        iteration: number;
    }, void, void>;

    constructor(dataSet: DataSet, config: Required<T>) {
        this.dataSet = dataSet;
        this._config = config;
        this.generator = this.initGenerator();
    }

    protected abstract initGenerator(): Generator<{
        solution: BinPacking[];
        iteration: number;
    }, void, void>;

    /**
     * Runs the algorithm.
     * @returns The generator.
     */
     public run() {
        return this.generator.next();
    }

    /**
     * The configuration options for the algorithm.
     * @returns The configuration options.
     */
    get config(): Required<T>{
        return this._config;
    }

    /**
     * Sets the configuration options for the algorithm.
     * @param config The configuration options.
     */
    set config(config: T){
        this._config = {
            ...this._config,
            ...config
        };
    }

    /**
     * The solution of the algorithm.
     * @returns The solution.
     */
    abstract get solution(): BinPacking;

    /**
     * The number of bins in the solution.
     * @returns The number of bins.
     */
    get numberOfBins():number{
        return this.solution.bins.length;
    }

    /**
     * The fitness of the solution.
     * @returns The fitness.
     */
    get fitness():number{
        return this.solution.fitness;
    }

}

export default Metaheuristique;