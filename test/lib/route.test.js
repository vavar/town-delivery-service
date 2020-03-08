const { calculateCheapestRoute, findPossibleRoute, findingRoute } = require('../../lib/route');
const assert = require('assert');


describe('lib/route - findingRoute', function () {
    const routesMap = {
        A: { edges: { B: 1, C: 4, D: 10 } },
        B: { edges: { E: 3 } },
        C: { edges: { D: 4, F: 2 } },
        D: { edges: { E: 1 } },
        E: { edges: { A: 2, B: 3 } },
        F: { edges: { D: 1 } },
    };
    it('Should get results for valid routes', function () {
        [
            { input: [routesMap, 'A-B-E'], expected: 4 },
            { input: [routesMap, 'A-D'], expected: 10 },
            { input: [routesMap, 'E-A-C-F'], expected: 8 },
            { input: [routesMap, 'C-D-E-B'], expected: 8 },
            { input: [routesMap, 'C-D-E-A'], expected: 7 },
        ].forEach(it => {
            const { input: [routes, path], expected } = it;
            assert.equal(findingRoute(routes, path), expected);
        });
    });

    it('Should get cost = `0` for invalid conditions or loop itself', function () {
        [
            { input: [routesMap, 'A-D-F'] },
            { input: [routesMap, 'A-B-C'] },
            { input: [routesMap, 'F-F'] },
        ].forEach(it => {
            const { input: [routes, path] } = it;
            assert(
                findingRoute(routes, path) === 0,
                'invalid condition should get `0` possible routes'
            );
        });
    });
});

describe('lib/route - findPossibleRoute', function () {
    const routesMap = {
        A: { edges: { B: 1, C: 4, D: 10 } },
        B: { edges: { E: 3 } },
        C: { edges: { D: 4, F: 2 } },
        D: { edges: { E: 1 } },
        E: { edges: { A: 2, B: 3 } },
        F: { edges: { D: 1 } },
    };
    it('Should get results for valid routes', function () {
        [
            { input: [routesMap, 'A', 'F', 10, 0, 1], expected: 1 },
            { input: [routesMap, 'A', 'F', 0, 5, 1], expected: 3 },
            { input: [routesMap, 'E', 'D', 0, 4, 1], expected: 4 },
            { input: [routesMap, 'E', 'E', 0, 0, 1], expected: 5 },
            { input: [routesMap, 'E', 'E', 20, 0, 2], expected: 29 },
        ].forEach(it => {
            const { input: [routes, start, stop, lessThanCost, maxStops, visitRoute], expected } = it;
            assert.equal(findPossibleRoute(routes, start, stop, lessThanCost, maxStops, visitRoute).length, expected);
        });
    });

    it('Should get `0` possible routes for invalid conditions', function () {
        [
            { input: [routesMap, 'B', 'E', 1, 1, 1] },
            { input: [routesMap, 'B', 'E', 3, 0, 1] },
            { input: [routesMap, 'E', 'E', 3, 1, 1] },
        ].forEach(it => {
            const { input: [routes, start, stop, lessThanCost, maxStops, visitRoute] } = it;
            assert(
                findPossibleRoute(routes, start, stop, lessThanCost, maxStops, visitRoute).length === 0,
                'invalid condition should get `0` possible routes'
            );
        });
    });
});

describe('lib/route - calculateCheapestRoute', function () {
    const routesMap = {
        A: { edges: { B: 1, C: 4, D: 10 } },
        B: { edges: { E: 3 } },
        C: { edges: { D: 4, F: 2 } },
        D: { edges: { E: 1 } },
        E: { edges: { A: 2, B: 3 } },
        F: { edges: { D: 1 } },
    };
    it('Should get results for valid routes', function () {
        [
            { input: [routesMap, 'E', 'D'], expected: { cost: 9, stops: 3, from: 'E', route: 'E->A->C->F->D' } },
            { input: [routesMap, 'E', 'E'], expected: { cost: 6, stops: 1, from: 'E', route: 'E->B->E', } },
            { input: [routesMap, 'A', 'F'], expected: { cost: 6, stops: 1, from: 'A', route: 'A->C->F', } },
            { input: [routesMap, 'C', 'C'], expected: { cost: 11, stops: 3, from: 'A', route: 'C->D->E->A->C', } },
        ].forEach(it => {
            const { input: [routes, start, stop], expected } = it;
            assert.deepEqual(calculateCheapestRoute(routes, start, stop), expected);
        });
    })

    it('Should get `null` for invalid routes', function () {
        [
            { input: [routesMap, 'I', 'I'] },
            { input: [routesMap, 'C', 'Z'] },
        ].forEach(it => {
            const { input: [routes, start, stop] } = it;
            assert(calculateCheapestRoute(routes, start, stop) === null, 'invalid route should be null');
        });
    })
});