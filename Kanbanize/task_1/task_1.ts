// Задача 1:
// Напишете функция, която групира даден списък от данни по определен критерий.
// Критерият е фунцкия, която трябва да връща числова стойност.
// Резултата от основната функция трябва да бъде масив от обекти, като примера по-долу. 

// Пример:
// const arrayData = [[1, 1, 2], [2, 3], [3, 5], [1, 4, 3]];
// const stringData = [‘elit’, ‘lorem’, ‘sit’, ‘ipsum’, ‘amet’];

// const groupsBy1 = groupByNumber(arrayData, (a) => a.length);
// const groupsBy2 = groupByNumber(stringData, (a) => a.length);

// console.log(groupsBy1);
// [{
//     ‘2’: [[2, 3],[3, 5]]
// },{
//     ‘3’: [[1, 1, 2],[1, 4, 3]]
// }]

// console.log(groupsBy2);
// [{
//     ‘3’: [‘sit’]
// }, {
// ‘4’: [elit’, ‘amet’]
// },
// {
//     ‘5’: [‘lorem’, ‘ipsum’]
// }]


const arrayData = [[1, 1, 2], [2, 3], [3, 5], [1, 4, 3]];
const stringData = ['elit', 'lorem', 'sit', 'ipsum', 'amet'];

const group = (data, cb: (a) => number) => {

    const mapResult = data.reduce((acc, curV) => {
        const cbRes = cb(curV);
        !acc.has(cbRes) ? acc.set(cbRes, [curV]) : acc.set(cbRes, [...acc.get(cbRes), curV]);
        return acc;
    }, new Map());

    const result = []
    mapResult.forEach((val, key) => {
        result.push({ [key]: val })
    })

    return result;
}

console.log(group(arrayData, (a) => a.length))
console.log(group(stringData, (a) => a.length))