import BinPacking from "../binPacking";
import DataSet from "../dataSet";
import Metaheuristique from "./metaheuristique";


export interface GenetiqueConfig{
    /**
     * The number of iterations for the Genetique algorithm.
     * @default dataSet.items.length**2
     */
    iteration?: number;
    /**
     * The size of the population.
     * @default 20
     */
    populationSize?: number;
}


/**
 * Represents a genetic algorithm for bin packing optimization.
 */
export default class Genetique extends Metaheuristique<GenetiqueConfig> {
    private generation: Array<BinPacking> = [];
    private newGeneration: Array<BinPacking> = [];

    /**
     * Creates a new instance of the Genetique class.
     * @param dataSet The dataset used for bin packing.
     * @param config The configuration options for the Genetique algorithm.
     */
    constructor(dataSet: DataSet, config?:GenetiqueConfig) {
        super(dataSet, {
            iteration: dataSet.items.length**2,
            populationSize: 20,
            ...config});
    }

    /**
     * Generates the initial population of solutions.
     */
    private generatePopulation(): void {
        while (this.generation.length < this.config.populationSize) {
            this.generation.push(this.dataSet.createRandomSolution());
        }
    }

    /**
     * Computes the fitness of each individual in the population.
     * Fitness is calculated as the sum of the squared used spaces in each bin.
     * The higher the fitness, the more filled a bin is.
     * The more evenly the used space is distributed, the lower the fitness.
     */
    private computeFitness(): void {
        const fitness = this.generation.map(individual => ({
            individual,
            fitness: individual.fitness
        }));

        fitness.sort((a, b) => b.fitness - a.fitness);
        this.generation = fitness.map(fit => fit.individual);
    }

    /**
     * Performs crossover between individuals in the population to create a new generation.
     */
    private crossover(): void {
        this.newGeneration = [this.generation[0]];
        for (let i = 1; i < (this.config.populationSize - 1) / 2; i++) {
            const parent1 = this.generation[i - 1];
            const parent2 = this.generation[i];

            const items1 = parent1.items;
            const items2 = parent2.items;

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
    private mutate(): void {
        for (let i = 1; i < this.newGeneration.length; i++) {
            const items = this.newGeneration[i].items;
            for (let index = 0; index < items.length; index++) {
                if (Math.random() > 0.1) continue;
                const itemToMove = items.splice(index, 1)[0].copy();
                itemToMove.rotate();
                const index2 = Math.floor(Math.random() * items.length);

                items.splice(index2, 0, itemToMove);
            }

            this.newGeneration[i] = new BinPacking(this.dataSet.binWidth, this.dataSet.binHeight, items);
        }

        this.generation = this.newGeneration;
    }

    /**
     * Runs the Genetique algorithm.
     * @returns A generator that yields the current solution and iteration number.
     */
    public * run() {
        for (let i = 1; i <= this.config.iteration; i++) {
            this.generatePopulation();
            this.computeFitness();
            this.crossover();
            this.mutate();
            yield {
                solution: this.generation,
                iteration: i
            };
        }
    }

    /**
     * Gets the current population of bin packing solutions.
     * @returns An array of BinPacking objects representing the population.
     */
    getPopulation(): Array<BinPacking> {
        return this.generation;
    }

    /**
     * Gets the best solution from the current population.
     * @returns The best BinPacking solution.
     */
    get solution(): BinPacking {
        return this.generation[0];
    }
}