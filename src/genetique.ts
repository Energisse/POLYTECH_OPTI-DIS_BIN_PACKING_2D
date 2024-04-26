import BinPacking from "./binPacking";
import DataSet from "./dataSet";
import Draw from "./draw";

/**
 * Represents a genetic algorithm for bin packing optimization.
 */
export default class Genetique {
    private generation: Array<BinPacking> = [];
    private newGeneration: Array<BinPacking> = [];
    private populationSize: number = 20;
    private dataSet: DataSet;

    /**
     * Creates a new instance of the Genetique class.
     * @param dataSet The dataset used for bin packing.
     */
    constructor(dataSet: DataSet) {
        this.dataSet = dataSet;
    }

    /**
     * Generates the initial population of solutions.
     */
    generatePopulation(): void {
        for (let i = 0; i < this.populationSize; i++) {
            this.generation.push(this.dataSet.createRandomSolution());
        }
    }

    /**
     * Computes the fitness of each individual in the population.
     * Fitness is calculated as the sum of the squared used spaces in each bin.
     * The higher the fitness, the more filled a bin is.
     * The more evenly the used space is distributed, the lower the fitness.
     */
    computeFitness(): void {
        const fitness = this.generation.map(individual => ({
            individual,
            fitness: individual.getBins().reduce((acc, bin) => acc + Math.pow(bin.getItems().reduce((acc, item) => acc + item.area, 0), 2), 0)
        }));

        fitness.sort((a, b) => b.fitness - a.fitness);
        this.generation = fitness.map(fit => fit.individual);
    }

    /**
     * Performs crossover between individuals in the population to create a new generation.
     */
    crossover(): void {
        this.newGeneration = [this.generation[0]];
        for (let i = 1; i < (this.populationSize - 1) / 2; i++) {
            const parent1 = this.generation[i - 1];
            const parent2 = this.generation[i];

            const items1 = parent1.getItems();
            const items2 = parent2.getItems();

            const index1 = Math.floor(Math.random() * items1.length);
            const index2 = Math.floor(Math.random() * items1.length);

            const start = Math.min(index1, index2);
            const end = Math.max(index1, index2);
            const delta = end - start;

            const removed = items1.splice(start, delta);
            items1.push(...items2.filter(item => removed.includes(item)));
            this.newGeneration.push(new BinPacking(this.dataSet.binWidth, this.dataSet.binHeight, items1));
        }
    }

    /**
     * Performs mutation on the new generation of individuals.
     * Mutation randomly modifies the order of items in each individual.
     */
    mutate(): void {
        for (let i = 1; i < this.newGeneration.length; i++) {
            const items = this.newGeneration[i].getItems();
            for (let index = 0; index < items.length; index++) {
                if (Math.random() > 0.1) continue;
                const itemToMove = items.splice(index, 1)[0].copy();
                itemToMove.rotate();
                const index2 = Math.floor(Math.random() * items.length);

                items.splice(index2, 0, itemToMove);
            }

            this.newGeneration[i] = new BinPacking(this.dataSet.binWidth, this.dataSet.binHeight, items);
        }

        while (this.newGeneration.length < this.populationSize)
            this.newGeneration.push(this.dataSet.createRandomSolution());

        this.generation = this.newGeneration;
    }

    /**
     * Draws the bin packing solutions in the population to image files.
     * @param path The path where the image files will be saved.
     */
    async draw(path: string): Promise<void> {
        for (let i = 0; i < this.populationSize; i++) {
            await Draw.drawBinPackingToFiles(this.generation[i], path + "/pop" + i);
        }
    }

    /**
     * Gets the current population of bin packing solutions.
     * @returns An array of BinPacking objects representing the population.
     */
    getPopulation(): Array<BinPacking> {
        return this.generation;
    }
}
