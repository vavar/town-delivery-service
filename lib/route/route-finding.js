
function findingRoute(routesMap = {}, paths='') {

    let cost = 0;
    let prevTown = null;
    const towns = paths.split('-');
    for (let i = 0; i < towns.length; i++) {
        const currentTown = towns[i];
        if (!prevTown) {
            prevTown = currentTown;
            continue;
        }
        const { edges:nextTowns } = routesMap[prevTown];
        if (!nextTowns[currentTown]) {
            return 0;
        }
        prevTown = currentTown;
        cost += nextTowns[currentTown];
    }
    return cost;
}

module.exports = {
    findingRoute,
}