import DataSet from '../dataSet';
import BinPacking from '../binPacking';
import Metaheuristique, { MetaheuristiqueConfig } from './metaheuristique';

export type RecuitSimuleConfig = {
    /**
     * The number of iterations for the RecuitSimule algorithm at each temperature.
     * @default dataSet.items.length
     */
    iterationByTemperature?: number;
    /**
     * The number of temperature decrease.
     * @default dataSet.items.length
     */
    iteration?: number;
    /**
     * The temperature decrease factor.
     * @default 0.8
     */
    temperatureDecrease?: number;
    /**
     * The initial temperature.
     * @default 1
     */
    temperature?: number;
} & MetaheuristiqueConfig

export default class RecuitSimule extends Metaheuristique<RecuitSimuleConfig> {
    private bestSolution: BinPacking;
    private bestFitness: number;
    private temperature: number;

    /**
     * Creates an instance of RecuitSimule.
     * @param {DataSet} dataSet - The data set for the problem.
     * @param {RecuitSimuleConfig} [config] - The configuration options for the RecuitSimule algorithm.
     */
    constructor(dataSet: DataSet, config?: RecuitSimuleConfig) {
        super(dataSet, {
            convergence: 10,
            iteration: dataSet.items.length,
            iterationByTemperature: dataSet.items.length,
            temperatureDecrease: 0.8,
            temperature: 1,
            ...config

        });
        this.bestSolution = this.dataSet.createRandomSolution();
        this.bestFitness = this.bestSolution.fitness;
        this.temperature = this.config.temperature;
    }


    /**
     * Initializes the generator for the Genetique algorithm.
     * @returns A generator that yields the current solution and iteration number.
     */
    protected * initGenerator() {
        let currentFitness = this.bestSolution.fitness;
        let currentSolution = this.bestSolution;

        let totalIteration = 1;
        for (let i = 1; i <= this.config.iteration; i++) {
            for (let j = 1; j <= this.config.iterationByTemperature; j++) {
                const neighbor = this.getRandomNeighboor();

                const fitness = neighbor.fitness;

                if (fitness >= currentFitness) {
                    currentSolution = neighbor;
                    currentFitness = fitness;
                    if (currentFitness > this.bestFitness) {
                        this.bestSolution = currentSolution;
                        this.bestFitness = currentFitness;
                    }
                }
                else {
                    const rand = Math.random();
                    if (rand < Math.exp((fitness - currentFitness) / this.temperature)) {
                        currentSolution = neighbor;
                    }
                }
                yield {
                    solution: [currentSolution],
                    iteration: totalIteration++
                };
            }
            this.temperature *= this.config.temperatureDecrease;
        }
    }

    /**
     * Gets random neighbor for the RecuitSimule algorithm.
     * @returns {BinPacking} - The random neighbor.
     */
    private getRandomNeighboor(): BinPacking {
        const items = this.bestSolution.items;

        while (true) {
            const i = Math.floor(Math.random() * items.length);
            const j = Math.floor(Math.random() * items.length);
            if (i === j) continue;

            const neighborItems = items.map(item => item.copy());
            neighborItems[i].rotate();
            neighborItems.splice(j, 0, neighborItems.splice(i, 1)[0]);

            return new BinPacking(this.dataSet.binWidth, this.dataSet.binHeight, neighborItems);
        }
    }

    /**
     * Gets the best solution from the HillClimbing algorithm.
     * @returns The best BinPacking solution.
     */
    get solution(): BinPacking {
        return this.bestSolution;
    }
}

