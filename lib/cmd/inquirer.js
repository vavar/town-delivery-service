const inquirer = require('inquirer');
const { parseNode } = require('../route');

function limitInputNumber(value) {
    try {
        let input = parseInt(value);
        if (input >= 0 && input <= 100) {
            return true;
        }
    }catch(err) {
    }
    return 'please input zero or possitive number (0-100)';
}


module.exports = {
    askCommand: () => {
        // main 
        const questions = [
            {
                type: 'input',
                name: 'directGraph',
                message: "Please input a directed graph",
                validate: (value) => {
                    let nodes = value.split(",");
                    if (nodes.filter(e => e.trim().length === 0).length > 0) {
                        return 'Please enter valid directgraph format';
                    }
                    let err = '';
                    let duplicated = {};
                    nodes.forEach(s => {
                        let [raw,from,to,cost] = parseNode(s);
                        if (!raw || !from || !to || !cost) {
                            err = `invalid direct graph node: ${s}\n`;
                            return;
                        }
                        if (cost <= 0) {
                            err = `invalid cost : ${s}\n`;
                            return;
                        }
                        let key = `${from.toUpperCase()}${to.toUpperCase()}`;
                        if (duplicated[key]) {
                            err = `Duplicate route found : ${s}`;
                            return;
                        }
                        duplicated[key] = true;
                    });

                    return (err.length === 0) ? true : err;
                },
                default: 'AB1, AC4, AD10, BE3, CD4, CF2, DE1, EB3, EA2, FD1'
            },
            {
                type: 'list',
                name: 'action',
                message: 'Please select use-case for apply',
                choices: [
                    { value: 'route-finding', name: 'Calculate the delivery cost of the given delivery route.' },
                    { value: 'possible-route', name: 'Calculate the number of possible delivery route that can be construct by the given conditions.' },
                    { value: 'cheapest-route', name: 'Calculate the cheapest delivery route between two town.' }
                ],
                default: 0,
            },
        ];

        return inquirer.prompt(questions);
    },
    askFindingPath: (routeMaps = {}) => {
        const questions = [
            {
                type: 'input',
                name: 'path',
                message: "Please given delivery route",
                validate: (value) => {
                    let nodes = value.split("-");
                    if (nodes.filter(e => e.trim().length === 0).length > 0) {
                        return 'Please enter valid delivery route';
                    }
                    let invalid = nodes.filter(e => !routeMaps[e.trim().toUpperCase()]);
                    if (invalid.length > 0) {
                        return `Please enter valid available town ${JSON.stringify(invalid)}`;
                    }
                    return true;
                },
                default: 'A-B-E'
            },
        ];
        return inquirer.prompt(questions);
    },
    askPossibleRoute: (routeMaps = {}) => {
        const availableTowns = Object.keys(routeMaps);
        const questions = [
            {
                type: 'list',
                name: 'start',
                message: "Select start town",
                choices: availableTowns,
                default: 0,
            },
            {
                type: 'list',
                name: 'stop',
                message: "Select stop town",
                choices: availableTowns,
                default: 0,
            },
            {
                type: 'input',
                name: 'maxCost',
                message: 'How much delivery cost should be less than (0=disable) ?',
                default: 0,
                validate: limitInputNumber,
            },
            {
                type: 'input',
                name: 'maxStops',
                message: 'What is maximum stops (0=disable) ?',
                default: 0,
                validate: limitInputNumber,
            },
            {
                type: 'input',
                name: 'maxSameRoute',
                message: 'How many times to using same route ?',
                default: 1,
                validate: limitInputNumber,
            }
        ];
        return inquirer.prompt(questions);
    },
    askCheapestRoute: (routeMaps = {}) => {
        const availableTowns = Object.keys(routeMaps);
        const questions = [
            {
                type: 'list',
                name: 'start',
                message: "Select start town",
                choices: availableTowns,
                default: 0,
            },
            {
                type: 'list',
                name: 'stop',
                message: "Select stop town",
                choices: availableTowns,
                default: 0,
            },
        ];
        return inquirer.prompt(questions);
    },
}