import DataSet from '../dataSet';
import BinPacking from '../binPacking';
import Metaheuristique from './metaheuristique';

export interface TabouConfig{
    /**
     * The number of iterations for the Tabou algorithm.
     * @default dataSet.items.length**2
     */
    iteration?: number;
    /**
     * The size of the tabou list.
     * @default dataSet.items.length/2
     */
    tabouSize?:number
}

class Tabou extends Metaheuristique{
    private tabou: Array<{ src: number; dest: number }> = [];
    private tabouSize: number;
    private iteration: number;
    private solution: BinPacking;

    /**
     * Creates an instance of Tabu.
     * @param {DataSet} dataSet - The data set for the problem.
     */
    constructor(dataSet: DataSet,config?:TabouConfig) {
        super(dataSet);
        this.solution = this.dataSet.createRandomSolution();
        this.tabou = [];
        this.iteration = config?.iteration || dataSet.items.length**2;
        this.tabouSize = config?.tabouSize || dataSet.items.length/2;
    }

    /**
     * Runs the Tabu algorithm.
     * @returns {void}
     */
    public run(): void {
        let bestFitness = this.solution.getFitness();

        for (let i = 1; i <= this.iteration; i++) {
            const neighbor = this.getBestNeighbors();

            if (neighbor.fitness <= bestFitness) {
                this.tabou.push({ src: neighbor.src, dest: neighbor.dest });
                if (this.tabou.length > this.tabouSize) {
                    this.tabou.shift();
                }
            }

            this.solution = neighbor.solution;
            bestFitness = neighbor.fitness;
            this.emit('newSolution',[this.solution],i);
        }
        this.emit('bestSolution',this.solution);
    }

    /**
     * Gets the best neighbors for the Tabu algorithm.
     * @returns {Object} - The best neighbors.
     */
    private getBestNeighbors(): {
        src: number;
        dest: number;
        solution: BinPacking;
        fitness: number;
    } {
        const items = this.solution.getItems();

        let src = 0;
        let dest = 0;
        let bestSolution: BinPacking | undefined;
        let bestFitness = 0;

        for (let i = 0; i < items.length; i++) {
            for (let j = 0; j < items.length; j++) {
                if (i === j) {
                    continue;
                }
                if (this.tabou.some(tabu => tabu.src === i && tabu.dest === j)) continue;

                const neighborItems = items.map(item => item.copy());
                neighborItems[i].rotate();
                neighborItems.splice(j, 0, neighborItems.splice(i, 1)[0]);

                const solution = new BinPacking(this.dataSet.binWidth, this.dataSet.binHeight, neighborItems);
                if (solution.getFitness() > bestFitness) {
                    src = i;
                    dest = j;
                    bestSolution = solution;
                    bestFitness = solution.getFitness();
                }
            }
        }

        return {
            dest,
            src,
            solution: bestSolution!,
            fitness: bestFitness
        };
    }
}

export default Tabou;