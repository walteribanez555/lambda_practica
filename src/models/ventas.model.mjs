import { DatabaseOperations, executeMysql } from '../utils/database.mjs';
import { buildResponse, validateData, colorLog, dateFormat, dateDiff, dateNow, parseJsonToObject } from '../utils/helpers.mjs';
// import Stripe from 'stripe';
// const stripe = new Stripe( process.env.STRIPE_TOKEN );


const tableName = 'ventas';
const keyField = 'venta_id';

const model = {
    username : 'string',
    office_id : 'number',
    cliente_id : 'number',
    tipo_venta : 'number',
    forma_pago : 'number',
    cantidad : 'string',
    descuento : 'string',
    tipo_descuento : 'string',
    plus : 'number',
    servicio_id : 'string',
    status : 'number'
};


export async function postVentas( { data, schema } ){ 
    try{
        const database = new DatabaseOperations( tableName, schema );
        // const newRegister = validateData( data, model );
        // if ( Object.keys( newRegister ).length === 0 )
        //     return buildResponse( 400, { message : 'Missing required fields or not valid' }, 'post' );

        const response = await database.create( data, keyField );
        return {response, keyField};

    }catch(err) { 
        colorLog( ` POST VENTAS ERROR:  ${ JSON.stringify( error ) }`, 'red', 'reset' );
        return buildResponse( 500, error, 'post' );
    }
}