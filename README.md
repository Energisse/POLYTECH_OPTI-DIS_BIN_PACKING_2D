# POLYTECH_OPTI-DIS_BIN_PACKING_2D

## Description

Ce projet implémente plusieurs algorithmes pour résoudre le problème de bin packing en 2D. Le but est de placer un ensemble de rectangles (items) dans un nombre minimal de conteneurs (bins) de dimensions fixes, de manière à minimiser l'espace inutilisé.

Les algorithmes implémentés incluent :
- Algorithme Génétique
- Algorithme Tabou
- Recuit Simulé
- Hill Climbing

## Structure du Projet

- `src/`: Contient le code source du projet.
  - `bin.ts`: Définit la classe `Bin`.
  - `binPacking.ts`: Définit la classe `BinPacking`.
  - `dataSet.ts`: Définit la classe `DataSet` pour gérer les ensembles de données.
  - `draw.ts`: Contient des fonctions pour dessiner les solutions de bin packing.
  - `index.ts`: Point d'entrée pour les exports de modules.
  - `Item.ts`: Définit la classe `Item`.
  - `main.ts`: Point d'entrée principal du programme.
  - `metaheuristique/`: Contient les implémentations des différents algorithmes.
- `test/`: Contient les tests unitaires.
- `binpacking2d/`: Contient les fichiers de données pour les instances de bin packing.
- `output/`: Contient les résultats générés par le programme.
- `.vscode/`: Contient les configurations pour Visual Studio Code.
- `jest.config.js`: Configuration pour Jest.
- `tsconfig.json`: Configuration pour TypeScript.
- `package.json`: Dépendances et scripts du projet.


# Run the project
```bash
npm i --include=dev
npm start
```