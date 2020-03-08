function getCheapestRoutes(routesMap = {}, start = '', stop = '', initPath = '', stops = 0, cost = 0) {

    const routes = {};
    const visittowns = {};
    let from = start;
    let origin = (!initPath.length) ? start: initPath;
    let route = (!initPath.length) ? `${from}` : `${initPath}->${from}`;
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
            routes[n] = { from: origin, cost, stops, route };
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
    if (!routesMap[start] || !routesMap[end]) {
        return null;
    }

    if (start !== end) {
        return getCheapestRoutes(routesMap, start, end);
    }

    //start === end , find alternate adjacent town route instead
    const { edges: towns} = routesMap[start];
    let paths = Object.keys(towns)
        .map(from => getCheapestRoutes(routesMap, from, end, `${start}`, 1, towns[from]))
        .filter(p => p !== null);

    if (!paths.length) {
        return null;
    }

    //find cheapest cost ( cost > stops )
    return paths.reduce((prev, curr) => prev.cost < curr.cost ? prev : (curr.stops > prev.stops) ? prev : curr);
}

module.exports = {
    calculateCheapestRoute
}