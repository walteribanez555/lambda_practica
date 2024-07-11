
// Dependencies
import { DatabaseOperations } from '../utils/database.mjs';
import { buildResponse, validateData, colorLog, age } from '../utils/helpers.mjs';


const tableName = 'beneficiarios';
const idField = 'beneficiario_id';
const keyField = 'poliza_id';

const model = {
    poliza_id : 'number',
    primer_apellido : 'string',
    segundo_apellido : 'string',
    primer_nombre : 'string',
    segundo_nombre : 'string',
    nro_identificacion : 'string',
    fecha_nacimiento : 'string',
    sexo : 'number',
    origen : 'string',
    email : 'string',
    telefono : 'string'
};



export async function postBeneficiarios( { data, schema } ) {
    try {
        const database = new DatabaseOperations( tableName, schema );
        const newRegister = validateData( data, model );
        if ( Object.keys( newRegister ).length === 0 )
            return buildResponse( 400, { message : 'Missing required fields or not valid' }, 'post' );

        newRegister.edad = age( newRegister.fecha_nacimiento );
    
        const response = await database.create( newRegister, keyField );
        return response;
    
    } catch ( error ) {
        colorLog( ` POST BENEFICIARIOS ERROR:  ${ JSON.stringify( error ) }`, 'red', 'reset' );
        return buildResponse( 500, error, 'post' );
    }
}