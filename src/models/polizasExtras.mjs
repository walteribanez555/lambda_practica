
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

        const beneficios = newRegister.beneficio_id.split(',');
        const montos = newRegister.monto_adicional.split(',');
        const result = [];
        for ( let i = 0; i < beneficios.length; i++ ) {
            const register = {
                venta_id : newRegister.venta_id,
                beneficio_id : beneficios[ i ],
                monto_adicional : montos[ i ],
            };
            const response = await database.create( register, keyField );
            result.push( response[ 0 ] );
        }
        return buildResponse( 200, result, 'post', keyField, data );
    
    } catch ( error ) {
        colorLog( ` POST POLIZAS EXTRAS ERROR:  ${ JSON.stringify( error ) }`, 'red', 'reset' );
        return buildResponse( 500, error, 'post' );
    }
}
