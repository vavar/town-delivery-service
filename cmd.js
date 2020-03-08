
const { doGetCommand, doPossibleRoute, doFindingPath, doCheapestRoute} = require('./lib/cmd');
const run = async () => {
    const {action, routeMaps} = await doGetCommand();
    switch(action) {
        case 'route-finding':
            await doFindingPath(routeMaps);
        break;
        case 'possible-route':
            await doPossibleRoute(routeMaps);
        break;
        case 'cheapest-route':
            await doCheapestRoute(routeMaps);
        break;
    }
}

run();