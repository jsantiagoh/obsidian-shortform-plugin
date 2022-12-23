import { groupBy, pickBy } from "./utils";

describe('Utils module', () => {
    test('groupby', () => {
        const ungrouped = [
            { date: '14/4/2021', item1: 'test1', item2: 'test2' },
            { date: '14/4/2021', item1: 'test3', item2: 'test4' },
            { date: '15/4/2021', item1: 'test1', item2: 'test2' }
        ];
        const grouped = groupBy(ungrouped, d => d.item1);

        expect(Object.keys(grouped).length).toBe(2);
        expect(grouped['test1'].length).toBe(2);
        expect(grouped['test3'].length).toBe(1);
    });

    test('pickBy', () => {
        const object = { 'a': 1, 'b': 2, 'c': 3, 'd': 4 };
        const actual = pickBy(object, n => {
            return n == 1 || n == 3;
        });

        expect(actual).toStrictEqual({ 'a': 1, 'c': 3 });
    });

});