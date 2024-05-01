import DataSet from '../dataSet';
import BinPacking from '../binPacking';
import Metaheuristique from './metaheuristique';

export interface RecruitSimuleConfig{
    /**
     * The number of iterations for the RecruitSimule algorithm at each temperature.
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
}

class RecruitSimule extends Metaheuristique{
    private iteration: number;
    private iterationByTemperature: number;
    private temperatureDecrease: number;
    private bestSolution: BinPacking;
    private bestFitness: number;
    private temperature: number;

    /**
     * Creates an instance of RecruitSimule.
     * @param {DataSet} dataSet - The data set for the problem.
     */
    constructor(dataSet: DataSet,config?:RecruitSimuleConfig) {
        super(dataSet);
        this.bestSolution = this.dataSet.createRandomSolution();
        this.bestFitness = this.bestSolution.fitness;
        this.iteration = config?.iteration || dataSet.items.length;
        this.iterationByTemperature = config?.iterationByTemperature || dataSet.items.length;
        this.temperatureDecrease = config?.temperatureDecrease || 0.8;
        this.temperature = config?.temperature || 1;
    }
    

    /**
     * Runs the RecruitSimule algorithm.
     */
    public * run() {
        let currentFitness = this.bestSolution.fitness;
        let currentSolution = this.bestSolution;

        let totalIteration = 1;
        for (let i = 1; i <= this.iteration; i++) {
            for(let j = 1; j <= this.iterationByTemperature; j++){
                const neighbor = this.getRandomNeighboor();

                const fitness = neighbor.fitness;

                if (fitness >= currentFitness) {
                    currentSolution = neighbor;
                    currentFitness = fitness;
                    if(currentFitness > this.bestFitness){
                        this.bestSolution = currentSolution;
                        this.bestFitness = currentFitness;
                    }
                }
                else{
                    const rand = Math.random();
                    if(rand < Math.exp((fitness - currentFitness)/this.temperature)){
                        currentSolution = neighbor;
                    }
                }
                totalIteration++;
                yield {
                    solution: [currentSolution],
                    iteration: totalIteration
                };
            }
            this.temperature *= this.temperatureDecrease;
        }
    }

    /**
     * Gets random neighbor for the RecruitSimule algorithm.
     * @returns {BinPacking} - The random neighbor.
     */
    private getRandomNeighboor(): BinPacking {
        const items = this.bestSolution.items;

        while(true){
            const i = Math.floor(Math.random() * items.length);
            const j = Math.floor(Math.random() * items.length);
            if(i === j) continue;

            const neighborItems = items.map(item => item.copy());
            neighborItems[i].rotate();
            neighborItems.splice(j, 0, neighborItems.splice(i, 1)[0]);

            return new BinPacking(this.dataSet.binWidth, this.dataSet.binHeight, neighborItems);
        }
    }
}

export default RecruitSimule;