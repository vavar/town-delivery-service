const { parseRoutes, findingRoute, findPossibleRoute, calculateCheapestRoute } = require('../route');
const { askCommand, askFindingPath, askPossibleRoute, askCheapestRoute} = require('./inquirer');

module.exports = {
    doGetCommand: async () => {
        const { action, directGraph} = await askCommand();
        const routeMaps = parseRoutes(directGraph);
        return { action, routeMaps};
    },

    doFindingPath: async (routeMaps = {}) => {
        const { path } = await askFindingPath(routeMaps);
        const inputPath = path.toUpperCase();
        const cost = findingRoute(routeMaps,inputPath) || 0;
        if (!cost) {
            console.log(`No Such Route`);
            return;
        }
        console.log(`The delivery cost for route ${inputPath}: ${cost}`);
    },

    doPossibleRoute: async (routeMaps = {}) => {
        const { start, stop, maxCost, maxStops, maxSameRoute } = await askPossibleRoute(routeMaps);
        const routes = findPossibleRoute(routeMaps, start, stop, +maxCost, +maxStops, +maxSameRoute) || [];
        console.log("------");
        console.log(`Possible Route: ${routes.length}`);
        routes.sort( (a,b) => a.stops <= b.stops ? -1 : 1 )
            .forEach(r => console.log(`- Route: ${r.path.join('->')} - cost: ${r.cost}, stops: ${r.stops}`));
    },
    doCheapestRoute: async (routeMaps = {}) => {
        const { start, stop } = await askCheapestRoute(routeMaps);
        const { route, cost, stops } = calculateCheapestRoute(routeMaps, start, stop) || {};
        if (!route) {
            console.log(`No Such Route`);
            return;
        }
        console.log(`Route: ${route} with cost: ${cost} and ${stops} stops`);
    }
}