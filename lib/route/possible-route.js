function findPossibleRoute(routeMap = {}, start = '', end = '', maxCost = 0, maxStops = 0, maxSameRoute = 1) {
    const stack = [];
    const begin = routeMap[start];
    const possibleRoutes = [];

    Object.keys(begin.edges).forEach(town => stack.push({
        town,
        path: [start, town],
        cost: begin.edges[town],
        stops: 1,
        visit: [`${start}${town}`]
    }));

    while (stack.length) {
        const { town, path, cost, stops, visit } = stack.pop();
        if (town === end) {
            possibleRoutes.push({ path, cost, stops, visit });
            if (maxSameRoute > 1) {
                const { edges: rerouteTowns } = routeMap[town];
                Object.keys(rerouteTowns).forEach(tt => stack.push({
                    town: tt,
                    path: [...path, tt],
                    cost: cost + rerouteTowns[tt],
                    stops: stops + 2,
                    visit: [...visit, `${town}${tt}`]
                }));
            }
        } else {
            const { edges: nextTowns } = routeMap[town];
            const nextTownKeys = Object.keys(nextTowns) || [];
            nextTownKeys
                .filter(t => !maxCost || (cost + nextTowns[t]) < maxCost)
                .filter(t => visit.filter(v => v === `${town}${t}`).length <= maxSameRoute)
                .filter(t => !maxStops || (t !== end ? stops : stops + 1) <= maxStops)
                .forEach(t => {
                    let nextCost = cost + nextTowns[t];
                    let nextStop = (t === end) ? stops : stops + 1;
                    let nextVisit = [...visit, `${town}${t}`];
                    let nextPath = [...path, t];
                    stack.push({
                        town: t,
                        path: nextPath,
                        cost: nextCost,
                        stops: nextStop,
                        visit: nextVisit
                    });
                });
        }
    }
    return possibleRoutes;
}

module.exports = {
    findPossibleRoute,
};