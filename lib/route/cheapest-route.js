function getCheapestRoutes(routesMap = {}, start = '', stop = '', prefix = '', stops = 0, cost = 0) {

    const routes = {};
    const visittowns = {};
    let from = start;
    let route = (prefix.length === 0) ? `${from}` : `${prefix}->${from}`;
    routes[from] = { from, cost, stops, route };

    while (from !== stop) {

        visittowns[from] = true;

        const { edges: towns } = routesMap[from];
        const { cost: currentUsage, stops: currentStop, route: currentRoute } = routes[from];

        Object.keys(towns).forEach(n => {
            const cost = towns[n] + currentUsage;
            const stops = (n === stop) ? currentStop : currentStop + 1;
            const route = `${currentRoute}->${n}`;
            if (routes[n] && routes[n].cost <= cost) {
                return;
            }
            routes[n] = { from: start, cost, stops, route };
        });

        const next = Object.keys(routes).filter(town => !visittowns[town]);
        if (!next.length) {
            return null;
        }
        from = next.reduce((acc, loc) => routes[acc].cost < routes[loc].cost ? acc : loc);
    }
    return routes[stop];
}

function calculateCheapestRoute(routesMap = {}, start = '', end = '') {
    if (!routesMap[start]) {
        return `No routes from ${start} to ${end}`;
    }

    if (start !== end) {
        return getCheapestRoutes(routesMap, start, end);
    }

    //start === end , find alternate adjacent town route instead
    const { edges: towns} = routesMap[start];
    let paths = Object.keys(towns)
        .map(from => {
            let initCost = towns[from];
            return getCheapestRoutes(routesMap, from, end, `${start}`, 1, initCost)
        })
        .filter(p => p !== null);

    if (paths.length == 0) {
        return `No routes from ${start} to ${end}`;
    }

    //find cheapest cost ( cost > stops )
    return paths.reduce((prev, curr) => prev.cost < curr.cost ? prev : (curr.stops > prev.stops) ? prev : curr);
}

module.exports = {
    calculateCheapestRoute
}