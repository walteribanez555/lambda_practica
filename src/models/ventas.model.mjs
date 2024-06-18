import { DatabaseOperations, executeMysql } from '../utils/database.mjs';
import { buildResponse, validateData, colorLog, dateFormat, dateDiff, dateNow, parseJsonToObject } from '../utils/helpers.mjs';
import Stripe from 'stripe';
const stripe = new Stripe( process.env.STRIPE_TOKEN );


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
    fecha_salida : 'string',
    fecha_retorno : 'string',
    servicio_id : 'string',
    multiviajes : 'string',
    status : 'number'
};


export async function postVentas( { data, schema } ){ 
    try{
        const database = new DatabaseOperations( tableName, schema);

        const newRegister = data;

        




    }catch(err) { 
        colorLog( ` POST VENTAS ERROR:  ${ JSON.stringify( error ) }`, 'red', 'reset' );
        return buildResponse( 500, error, 'post' );
    }
}