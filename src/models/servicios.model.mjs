/** 
 * 
 * servicios function
 * 
*/

// Dependencies
import { DatabaseOperations } from '../utils/database.mjs';
import { buildResponse, validateData, colorLog } from '../utils/helpers.mjs';
const tableName = 'servicios';
const keyField = 'servicio_id';
const model = {
    servicio : 'string',
    descripcion : 'string',
    precio_base : 'number',
    edad_base : 'number',
    edad_limite : 'number',
    cobertura_global : 'number',
    tiempo_limite : 'number',
    cupones : 'number',
    descuento : 'number',
    moneda : 'string',
    img : 'string',
    disponibilidad : 'string',
    status : 'number'
};

export async function getServicios( { id, schema } ) {
    try {
        const database = new DatabaseOperations( tableName, schema );
        const data = { 
            where : {
                [ keyField ] : id
            } 
        };
        const response = await database.read( data );
        const result = response.map( item => {
            return {
                servicio_id : item.servicio_id,
                servicio : item.servicio,
                atencion_medica : item.descripcion,
                precio_base : item.precio_base,
                edad_base : item.edad_base,
                edad_limite : item.edad_limite,
                cobertura_global : item.cobertura_global,
                tiempo_limite : item.tiempo_limite,
                cupones : item.cupones,
                descuento : item.descuento,
                moneda : item.moneda,
                img : item.img,
                disponibilidad : item.disponibilidad,
                status : item.status
            };
        });



        return buildResponse( 200, result, 'get' );
    } catch ( error ) {
        colorLog( ` GET SERVICIOS ERROR:  ${ JSON.stringify( error ) }`, 'red', 'reset' );
        return buildResponse( 500, error, 'get' );
    }
}

export async function postServicios( { data, schema } ) {
    try {
        const database = new DatabaseOperations( tableName, schema );
        const newRegister = validateData( data, model );
        if ( Object.keys( newRegister ).length === 0 )
            return buildResponse( 400, { message : 'Missing required fields or not valid' }, 'post' );

        const response = await database.create( newRegister, keyField );
        return buildResponse( 200, response, 'post', keyField, data );
    } catch ( error ) {
        colorLog( ` POST SERVICIOS ERROR:  ${ JSON.stringify( error ) }`, 'red', 'reset' );
        return buildResponse( 500, error, 'post' );
    }
}

export async function putServicios( { id, data, schema } ) {
    try {
        const database = new DatabaseOperations( tableName, schema );
        const update = validateData( data, model, 'put' );

        if ( Object.keys( update ).length === 0 )
            return buildResponse( 400, { message : 'Missing fields to update' }, 'put' );

        if ( !id )
            return buildResponse( 400, { message : 'Missing the record id to update' }, 'put' );

        const where = {
            [ keyField ] : id
        };
        const response = await database.update( update, where );
        return buildResponse( 200, response, 'put' );
    } catch( error ) { 
        colorLog( ` PUT SERVICIOS ERROR:  ${ JSON.stringify( error ) }`, 'red', 'reset' );
        return buildResponse( 500, error, 'put' );
    }
}

export async function deleteServicios( { id,schema } ) {
    try {
        const database = new DatabaseOperations( tableName, schema, schema );
        if ( !id )
            return buildResponse( 400, { message : 'Missing the record id to delete' }, 'delete' );

        await database.delete( id, keyField );
        return buildResponse( 200, { message : 'Register deleted!' }, 'delete' );

    } catch( error ) { 
        colorLog( ` DELETE SERVICIOS ERROR:  ${ JSON.stringify( error ) }`, 'red', 'reset' );
        return buildResponse( 500, error, 'delete' );
    }
}
