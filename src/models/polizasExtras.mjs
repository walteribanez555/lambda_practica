
// Dependencies
import { DatabaseOperations } from '../utils/database.mjs';
import { buildResponse, validateData, colorLog } from '../utils/helpers.mjs';

const tableName = 'poliza_extra';
const idField = 'poliza_extra_id';
const keyField = 'venta_id';

const model = {
    venta_id : 'number',
    beneficio_id : 'string',
    monto_adicional : 'string',
};

export async function getPolizasExtras( { id, schema } ) {
    try {
        const database = new DatabaseOperations( tableName, schema );
        const data = { 
            where : {
                [ keyField ] : id
            } 
        };
        const response = await database.read( data );
        return buildResponse( 200, response, 'get' );
    } catch ( error ) {
        colorLog( ` GET POLIZAS EXTRAS ERROR:  ${ JSON.stringify( error ) }`, 'red', 'reset' );
        return buildResponse( 500, error, 'get' );
    }
}

export async function postPolizasExtras( { data, schema } ) {
    try {
        const database = new DatabaseOperations( tableName, schema );
        const newRegister = validateData( data, model );
        if ( Object.keys( newRegister ).length === 0 )
            return buildResponse( 400, { message : 'Missing required fields or not valid' }, 'post' );
        

        const result = await database.create( newRegister, keyField );

        return result;
    
    } catch ( error ) {
        // colorLog( ` POST POLIZAS EXTRAS ERROR:  ${ JSON.stringify( error ) }`, 'red', 'reset' );
        // return buildResponse( 500, error, 'post' );
        throw error;
    }
}
