
export const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
    arr.reduce((groups, item) => {
        (groups[key(item)] ||= []).push(item);
        return groups;
    }, {} as Record<K, T[]>);


// I don't want to add lodash, so I wrote this
export function pickBy<T>(object: { [x: string]: T; }, predicate: (o: T) => boolean) {
    const result: { [key: string]: T } = {};
    for (const key in object) {
        if (predicate(object[key])) {
            result[key] = object[key];
        }
    }
    return result;
}