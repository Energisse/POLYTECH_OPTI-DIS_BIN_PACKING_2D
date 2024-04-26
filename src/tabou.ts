import fs from 'fs';
import DataSet from './dataSet';
import BinPacking from './binPacking';
import Draw from './draw';

export default class Tabu {
    private tabu: Array<{ src: number; dest: number }> = [];
    private tabuSize: number = 50;
    private dataSet: DataSet;
    private solution: BinPacking;

    /**
     * Creates an instance of Tabu.
     * @param {DataSet} dataSet - The data set for the problem.
     */
    constructor(dataSet: DataSet) {
        this.dataSet = dataSet;
        this.solution = this.dataSet.createRandomSolution();
    }

    /**
     * Runs the Tabu algorithm.
     * @returns {Promise<void>}
     */
    public async run(): Promise<void> {
        let bestFitness = this.solution.getFitness();
        await fs.promises.mkdir('./output/tabou/').catch(() => {});
        await Draw.drawBinPackingToFiles(this.solution, './output/tabou/init');

        for (let i = 0; i < 300; i++) {
            const neighbor = this.getBestNeighbors();

            if (neighbor.fitness <= bestFitness) {
                this.tabu.push({ src: neighbor.src, dest: neighbor.dest });
                if (this.tabu.length > this.tabuSize) {
                    this.tabu.shift();
                }
            }

            this.solution = neighbor.solution;
            bestFitness = neighbor.fitness;

            await Draw.drawBinPackingToFiles(this.solution, `./output/tabou/${i}`);
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
                if (this.tabu.some(tabu => tabu.src === i && tabu.dest === j)) continue;

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
