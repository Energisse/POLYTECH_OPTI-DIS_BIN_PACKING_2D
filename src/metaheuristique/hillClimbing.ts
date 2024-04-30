import DataSet from '../dataSet';
import BinPacking from '../binPacking';
import Metaheuristique from './metaheuristique';

class HillClimbing extends Metaheuristique{
    private solution: BinPacking;

    /**
     * Creates an instance of HillClimbing.
     * @param {DataSet} dataSet - The data set for the problem.
     */
    constructor(dataSet: DataSet) {
        super(dataSet);
        this.solution = this.dataSet.createRandomSolution();
    }

    /**
     * Runs the HillClimbing algorithm.
     * @returns {void}
     */
    public run(): void {
        let bestFitness = this.solution.getFitness();
        let iteration = 1;
        while(true) {
            const neighbor = this.getBestNeighbors();
            if (neighbor.fitness <= bestFitness) break
            this.solution = neighbor.solution;
            bestFitness = neighbor.fitness;
            this.emit('newSolution',[this.solution],iteration++);
        }
        this.emit('bestSolution',this.solution);
    }

    //TODO: merge with tabou
    /**
     * Gets the best neighbors for the HillClimbing algorithm.
     * @returns {Object} - The best neighbors.
     */
    private getBestNeighbors(): {
        solution: BinPacking;
        fitness: number;
    } {
        const items = this.solution.getItems();

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
                if (solution.getFitness() > bestFitness) {
                    bestSolution = solution;
                    bestFitness = solution.getFitness();
                }
            }
        }

        return {
            solution: bestSolution!,
            fitness: bestFitness
        };
    }
}

export default HillClimbing;