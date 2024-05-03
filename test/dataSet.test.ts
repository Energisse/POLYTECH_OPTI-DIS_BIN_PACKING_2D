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
        expect(binPacking.items[0]).toEqual(new Item(1,167,184,binPacking.items[0].color));
        expect(binPacking.items[1]).toEqual(new Item(2,114,118,binPacking.items[1].color));
        expect(binPacking.items[2]).toEqual(new Item(3,167,152,binPacking.items[2].color));
        expect(binPacking.items[3]).toEqual(new Item(4,69,165,binPacking.items[3].color));
    });

    test('getMinBinAmount', () => {
        const binPacking = new DataSet(string);

        expect(binPacking.minBinAmount).toBe(2);
    });
});