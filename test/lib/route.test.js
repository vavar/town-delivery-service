const { calculateCheapestRoute } = require('../../lib/route');
const assert = require('assert');
describe('lib/route - calculateCheapestRoute', function () {
    let routesMap = {
        A: { edges: { B: 5, D: 15 } },
        B: { edges: { A: 5, C: 5 } },
        C: { edges: { B: 5, D: 7 } },
        D: { edges: { A: 15, C: 7 } },
        // ---------
        E: { edges: { F: 5 } },
        F: { edges: { E: 5, G: 5 } },
        G: { edges: { F: 5, H: 10, J: 20 } },
        H: { edges: { G: 10, I: 10 } },
        I: { edges: { H: 10, J: 5 } },
        J: { edges: { G: 20 } },
    };
    it('Should get results for valid routes', function () {
        // A -> B
        assert.deepEqual(calculateCheapestRoute(routesMap, 'A', 'B'), { cost: 5, from: 'A', route: 'A->B', stops: 0});
        // B -> A
        assert.deepEqual(calculateCheapestRoute(routesMap, 'B', 'A'), { cost: 5, from: 'B', route: 'B->A', stops: 0});
        // A -> B -> C
        assert.deepEqual(calculateCheapestRoute(routesMap, 'A', 'C'), { cost: 10, stops: 1, from: 'A', route:'A->B->C'});
        // E -> F -> G -> J = 30 < E -> F -> H -> I -> J = 35
        assert.deepEqual(calculateCheapestRoute(routesMap, 'E', 'J'), { cost: 30, stops: 2, from: 'E', route: 'E->F->G->J'});
        // E -> F -> H -> I = 30
        assert.deepEqual(calculateCheapestRoute(routesMap, 'E', 'I'), { cost: 30, stops: 3, from: 'E', route: 'E->F->G->H->I'});
        // I -> J = 5
        assert.deepEqual(calculateCheapestRoute(routesMap, 'I', 'J'), { cost: 5, stops: 0, from: 'I', route: 'I->J'});
    })

    it('Should get error for invalid routes', function () {
        assert.equal(calculateCheapestRoute(routesMap, 'A', 'E'), null);
        assert.equal(calculateCheapestRoute(routesMap, 'E', 'C'), null);
        assert.equal(calculateCheapestRoute(routesMap, 'E', 'D'), null);
        assert.equal(calculateCheapestRoute(routesMap, 'J', 'A'), null);
    })
});