const { findingRoute } = require('./route-finding');
const { findPossibleRoute } = require('./possible-route');
const { calculateCheapestRoute } = require('./cheapest-route');

function createNode(base = { edges: {} }, town = '', cost = '') {
    base.edges[town] = +cost;
    return base;
}

function parseNode(node) {
    return /^([a-zA-Z])([a-zA-Z])(\d+)$/.exec(node.trim()) || [];
}

function parseRoutes(input = '') {
    if (input.length === 0) {
        return {};
    }
    let routesMap = {};
    input.toUpperCase().split(',').forEach(s => {
        let [,from,to,cost] = parseNode(s);
        routesMap[from] = createNode(routesMap[from], to, cost);
    });
    return routesMap;
}

module.exports = {
    calculateCheapestRoute,
    findingRoute,
    findPossibleRoute,
    parseNode,
    parseRoutes,
    
};