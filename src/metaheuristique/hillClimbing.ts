import DataSet from '../dataSet';
import BinPacking from '../binPacking';
import Metaheuristique from './metaheuristique';

export interface HillClimbingConfig{
}

export default class HillClimbing extends Metaheuristique<HillClimbingConfig>{
    private bestSolution: BinPacking;

    /**
     * Creates an instance of HillClimbing.
     * @param {DataSet} dataSet - The data set for the problem.
     * @param {HillClimbingConfig} [config] - The configuration options for the HillClimbing algorithm.
     */
    constructor(dataSet: DataSet, config?: HillClimbingConfig) {
        super(dataSet,{
            ...config
        });
        this.bestSolution = this.dataSet.createRandomSolution();
    }

    /**
     * Initializes the generator for the Genetique algorithm.
     * @returns A generator that yields the current solution and iteration number.
     */
    protected * initGenerator(){
        let bestFitness = this.bestSolution.fitness;
        let iteration = 1;
        while(true) {
            const neighbor = this.getBestNeighbors();
            if (neighbor.fitness <= bestFitness) break
            this.bestSolution = neighbor.solution;
            bestFitness = neighbor.fitness;
            yield {
                solution: [this.bestSolution],
                iteration: iteration++
            };
        }
    }

    /**
     * Gets the best neighbors for the HillClimbing algorithm.
     * @returns The best neighbors.
     */
    private getBestNeighbors(): {
        solution: BinPacking;
        fitness: number;
    } {
        const items = this.bestSolution.items;

        let bestSolution: BinPacking | undefined;
        let bestFitness = 0;
        for (let i = 0; i < items.length; i++) {
            for (let j = 0; j < items.length; j++) {
                if (i === j) {
                    continue;
                }

                const neighborItems = items.map(item => item.copy());
                neighborItems[i].rotate();
                neighborItems.splice(j, 0, neighborItems.splice(i, 1)[0]);
                const solution = new BinPacking(this.dataSet.binWidth, this.dataSet.binHeight, neighborItems);
                if (solution.fitness > bestFitness) {
                    bestSolution = solution;
                    bestFitness = solution.fitness;
                }
            }
        }

        return {
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