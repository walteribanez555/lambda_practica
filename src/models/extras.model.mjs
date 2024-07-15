/** 
 * 
 * extras function
 * 
*/

// Dependencies
import { DatabaseOperations } from '../utils/database.mjs';
import { buildResponse, validateData, colorLog } from '../utils/helpers.mjs';
const tableName = 'extras';
const keyField = 'beneficio_id';
const model = {
    descripcion : 'string',
    cobertura : 'number',
    moneda : 'string',
    complemento : 'string',
    tipo_valor : 'number',
    incremento : 'number',
    color : 'string',
    icono : 'string',
    status : 'number'
};

export async function getExtras( { id, schema } ) {
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
        colorLog( ` GET EXTRAS ERROR:  ${ JSON.stringify( error ) }`, 'red', 'reset' );
        return buildResponse( 500, error, 'get' );
    }
}



