import BinPacking from "../binPacking";
import DataSet from "../dataSet";

export interface MetaheuristiqueConfig {
    /**
     * Number of iterations without improvement before stopping the algorithm.
     * if set to 0, the algorithm will run until the maximum number of iterations is reached.
     */
    convergence?: number;
}


abstract class Metaheuristique<T> implements Iterable<{
    solution: BinPacking[];
    iteration: number;
}> {
    readonly dataSet: DataSet;
    private _config: Required<T> & Required<MetaheuristiqueConfig>;
    readonly generator: Generator<{
        solution: BinPacking[];
        iteration: number;
    }, void, void>;
    private lastFitness: number = 0;
    private convergenceCounter: number = 0;

    constructor(dataSet: DataSet, config: Required<T> & Required<MetaheuristiqueConfig>) {
        this.dataSet = dataSet;
        this._config = config;
        this.generator = this.convergenceGenerator();
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

    private * convergenceGenerator(): Generator<{ solution: BinPacking[]; iteration: number; }, void, void> {
        const generator = this.initGenerator();
        for (const { solution, iteration } of generator) {
            if (this._config.convergence !== 0) {
                if (this.lastFitness >= solution[0].fitness) {
                    this.convergenceCounter++;
                    if (this.convergenceCounter >= this._config.convergence) {
                        generator.return();
                    }
                }
                else {
                    this.lastFitness = this.fitness;
                    this.convergenceCounter = 0;
                }
            }
            yield { solution, iteration };
        }
    }

    /**
     * The iterator for the algorithm.
     * @returns The iterator.
     */
    [Symbol.iterator](): Iterator<{ solution: BinPacking[]; iteration: number; }, any, undefined> {
        return this.generator;
    }

    /**
     * The configuration options for the algorithm.
     * @returns The configuration options.
     */
    get config(): Required<T> & Required<MetaheuristiqueConfig> {
        return this._config;
    }

    /**
     * Sets the configuration options for the algorithm.
     * @param config The configuration options.
     */
    set config(config: T) {
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
    get numberOfBins(): number {
        return this.solution.bins.length;
    }

    /**
     * The fitness of the solution.
     * @returns The fitness.
     */
    get fitness(): number {
        return this.solution.fitness;
    }

}

export default Metaheuristique;