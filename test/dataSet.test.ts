import {describe, expect, test} from '@jest/globals';
import BinPacking from '../src/binPacking';
import dedent from "dedent";
import Item from '../src/Item';
import { DataSet } from '../src';

const string = dedent`
NAME: un nom
COMMENT: un commentaire
NB_ITEMS: 4
BIN_WIDTH: 250
BIN_HEIGHT: 250

ITEMS [id width height]:
1 167 184
2 114 118
3 167 152
4 69 165`

describe('datSet', () => {

    test('from string', () => {

        const binPacking = new DataSet(string);

        expect(binPacking.binHeight).toEqual(250);
        expect(binPacking.binWidth).toEqual(250);
        expect(binPacking.comment).toEqual("un commentaire");
        expect(binPacking.name).toEqual("un nom");

        expect(binPacking.items).toHaveLength(4);
        expect(binPacking.items[0]).toEqual(new Item(1,167,184));
        expect(binPacking.items[1]).toEqual(new Item(2,114,118));
        expect(binPacking.items[2]).toEqual(new Item(3,167,152));
        expect(binPacking.items[3]).toEqual(new Item(4,69,165));
    });

    test('getMinBinAmount', () => {
        const binPacking = new DataSet(string);

        expect(binPacking.minBinAmount).toBe(2);
    });
});