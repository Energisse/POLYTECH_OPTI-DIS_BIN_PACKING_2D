import fs from 'fs';
import DataSet from './dataSet';
import Genetique from './metaheuristique/genetique';
import Draw from './draw';
import Tabou from './metaheuristique/tabou';
import Metaheuristique from './metaheuristique/metaheuristique';
const binPackingFolder:string = "./binpacking2d/";

const folders = fs.readdirSync(binPackingFolder)
const dataSet = folders.map(folder => new DataSet(binPackingFolder + folder));
fs.rmdirSync('./output', { recursive: true })

    const tabou:Metaheuristique = new Genetique(dataSet[11],100000);

    tabou.on('newSolution', async (solution,i) => {
        if(i%10000 == 0 || i == 1){
            if(tabou instanceof Tabou ){
                Draw.drawBinPackingToFilesSync(solution[0], './output/tabou/'+i);
            }
            else solution.map((sol,pop)=>Draw.drawBinPackingToFilesSync(sol, './output/genetique/'+i+'/pop'+pop));
        }
    })  

    tabou.run();
