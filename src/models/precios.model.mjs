// Dependencies
import { DatabaseOperations } from '../utils/database.mjs';
import { buildResponse, validateData, colorLog } from '../utils/helpers.mjs';
const tableName = 'precios';
const keyField = 'servicio_id';
const model = {
    servicio_id : 'number',
    precio : 'number',
    limite_inferior : 'number',
    limite_superior : 'number',
    pendiente : 'number',
    intercepto : 'number',
    tipo_ecuacion : 'number'
};


export async function getPrecios( { id, schema } ) {
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
        colorLog( ` GET PRECIOS ERROR:  ${ JSON.stringify( error ) }`, 'red', 'reset' );
        return buildResponse( 500, error, 'get' );
    }
}
