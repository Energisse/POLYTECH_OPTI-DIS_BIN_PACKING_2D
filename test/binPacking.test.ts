import {describe, expect, test} from '@jest/globals';
import BinPacking from '../src/binPacking';
import dedent from "dedent";
import Item from '../src/Item';

describe('binPacking', () => {
    test('from string', () => {
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

        const binPacking = BinPacking.fromString(string);

        expect(binPacking).toEqual(new BinPacking("un nom", "un commentaire", 4, 250, 250, 
            [
                new Item(1, 167, 184),
                new Item(2, 114, 118),
                new Item(3, 167, 152),
                new Item(4, 69, 165)
            ]));
    });

    test('getMinBinAmount', () => {
        const binPacking = new BinPacking("un nom", "un commentaire", 4, 250, 250, 
            [
                new Item(1, 167, 184),
                new Item(2, 114, 118),
                new Item(3, 167, 152),
                new Item(4, 69, 165)
            ]);

        const minBinAmount = binPacking.getMinBinAmount();

        expect(minBinAmount).toBe(2);
    });
});