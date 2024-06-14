/* eslint-disable no-undef */
/** 
 * 
 * Ping
 * 
*/

// Dependencies
import { buildResponse, age } from './helpers.mjs';
const routes = [ 
    {
        name : 'ping',
        method : 'GET',
        path : '/'
    },
];

export function ping () {
    const database = [ 'mongo', 'mysql', 'postgres' ];
    const output = {
        'Host' : 'https://jxow6vi09g.execute-api.us-east-1.amazonaws.com/',
        'Environment' : 'dev',
        'Status' : 'available',
        'Server Date Time' : new Date(),
        'Last Update' : process.env.lastUpdate,
        'Api Routes' : routes,
        'Available Database Connections' : database,
        'AGE' : age('1976/02/23')
    };
    return buildResponse( 200, output, 'get' );
}
