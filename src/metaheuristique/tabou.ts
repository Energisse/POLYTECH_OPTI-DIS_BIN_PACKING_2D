import DataSet from '../dataSet';
import BinPacking from '../binPacking';
import Metaheuristique, { MetaheuristiqueConfig } from './metaheuristique';

export type TabouConfig = {
    /**
     * The number of iterations for the Tabou algorithm.
     * @default dataSet.items.length**2
     */
    iteration?: number;
    /**
     * The size of the tabou list.
     * @default dataSet.items.length/2
     */
    tabouSize?: number
} & MetaheuristiqueConfig

export default class Tabou extends Metaheuristique<TabouConfig> {
    private tabou: Array<{ src: number; dest: number }> = [];
    private bestSolution: BinPacking;

    /**
     * Creates an instance of Tabu.
     * @param {DataSet} dataSet - The data set for the problem.
     * @param {TabouConfig} [config] - The configuration options for the Tabou algorithm.
     */
    constructor(dataSet: DataSet, config?: TabouConfig) {
        super(dataSet, {
            convergence: 10,
            iteration: dataSet.items.length ** 2,
            tabouSize: dataSet.items.length / 2,
            ...config
        });
        this.bestSolution = this.dataSet.createRandomSolution();
        this.tabou = [];
    }

    /**
     * Initializes the generator for the Genetique algorithm.
     * @returns A generator that yields the current solution and iteration number.
     */
    protected * initGenerator() {
        let bestFitness = this.bestSolution.fitness;

        for (let i = 1; i <= this.config.iteration; i++) {
            const neighbor = this.getBestNeighbors();

            if (neighbor.fitness <= bestFitness) {
                this.tabou.push({ src: neighbor.src, dest: neighbor.dest });
                if (this.tabou.length > this.config.tabouSize) {
                    this.tabou.shift();
                }
            }

            this.bestSolution = neighbor.solution;
            bestFitness = neighbor.fitness;
            yield {
                solution: [this.bestSolution],
                iteration: i
            };
        }
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
        const items = this.bestSolution.items;

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
                if (solution.fitness > bestFitness) {
                    src = i;
                    dest = j;
                    bestSolution = solution;
                    bestFitness = solution.fitness;
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

    /**
     * Gets the best solution from the HillClimbing algorithm.
     * @returns The best BinPacking solution.
     */
    get solution(): BinPacking {
        return this.bestSolution;
    }
}