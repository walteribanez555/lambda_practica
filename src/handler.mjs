import { getCoberturas } from "./controllers/coberturas.controller.mjs";
import { getExtras } from "./controllers/extras.controller.mjs";
import { getPlanes } from "./controllers/planes.controller.mjs";
import { getPrecios } from "./controllers/precios.controller.mjs";
import { getVentas } from "./controllers/ventas.controller.mjs";
import { ping } from "./utils/ping.mjs";
import { buildResponse, parseJsonToObject } from './utils/helpers.mjs';

export const handler = async (event) => {
    console.log( 'Main Fecha-Hora: ', new Date() );
    console.log( 'EVENT: ' , event );
    const { method, path } = event?.requestContext?.http ? event.requestContext.http : {};
    const { id } = typeof( event.queryStringParameters ) === 'object' && Object.keys( event.queryStringParameters ).length > 0 ? event.queryStringParameters : false;
    const data = typeof( event.body ) === 'string' && Object.keys( parseJsonToObject( event.body ) ).length > 0 ? parseJsonToObject( event.body ) : {};
    console.log( 'DATA: ' , data );
    console.log( 'ID: ' , id );
    console.log( 'METHOD: ' , method.toLowerCase() );
    console.log( 'PATH: ' , path );
    // Your Lambda function code

    const endpoints = {
        '/' : ping,
        '/coberturas' : {
            'get': getCoberturas,
        },
        '/extras' : {
            'get' : getExtras,
        },
        '/planes' : {
            'get' :getPlanes,
        },
        '/precios' : {
            'get' : getPrecios,
        },
        '/ventas' : {
            'get' : getVentas,
        },
        'others' : buildResponse,

    }

    if(path === '/'){
        return endpoints[path]()
    }

    // if(!authorization)
    //     return endpoints.others(401, {message : '401 Access denied'}, 'other');

    try {
        // const verified = jwt.verify( authorization, process.env.SECRET )
        // console.log( 'VERIFIED: ', verified );
        if ( endpoints.hasOwnProperty( path ) )
            return await endpoints[ path ][ method.toLowerCase() ]( { id, init, end, nro_identificacion, data } );

        return endpoints.others( 404, { message : '404 Not Found' }, 'other' );

    } catch ( error ) {
        console.log( 'ERROR VERIFIED: ', error );
        return endpoints.others( 400, { message : '400 Invalid Token' }, 'other' );
    }
    


};