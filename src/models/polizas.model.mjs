import { DatabaseOperations, executeMysql } from '../utils/database.mjs';
import { buildResponse, colorLog, dateDiff, dateFormat, validateData } from '../utils/helpers.mjs';


const tableName = 'polizas';
const keyField = 'poliza_id';

const model = {
    venta_id : 'number',
    servicio_id : 'number',
    destino : 'string',
    fecha_salida : 'string',
    fecha_retorno : 'string',
    extra : 'number',
    status : 'number', 
    username : 'string',
};


export async function getPolizas( { id, schema } ) {
    try {

        const where = id ? `where polizas.poliza_id = ${ id }` : '';

        const sql = `select ventas.venta_id, ventas.status, ventas.office_id, ventas.username, ventas.fecha_venta, ventas.forma_pago,
        ventas.cantidad, ventas.precio, ventas.total, ventas.plus, ventas.comision, ventas.tipo_descuento, ventas.descuento, ventas.descuento_extra,
        ventas.total_pago, polizas.poliza_id, polizas.status as poliza_st, polizas.servicio_id, polizas.destino, polizas.fecha_salida, polizas.fecha_retorno,    
        polizas.nro_dias, polizas.extra, polizas.multiviaje, polizas.fecha_caducidad,
        beneficiarios.beneficiario_id, beneficiarios.primer_apellido, beneficiarios.segundo_apellido, beneficiarios.primer_nombre,
        beneficiarios.segundo_nombre, beneficiarios.nro_identificacion, beneficiarios.fecha_nacimiento, beneficiarios.edad, beneficiarios.origen,
        beneficiarios.email, beneficiarios.telefono
        FROM ventas
        INNER JOIN polizas ON ventas.venta_id = polizas.venta_id
        INNER JOIN beneficiarios ON polizas.poliza_id = beneficiarios.poliza_id        
        ${ where }`;
        const response = await executeMysql( sql, schema );

        return buildResponse( 200, response, 'get' );
    } catch ( error ) {
        colorLog( ` GET REPORTE DE POLIZAS ERROR:  ${ JSON.stringify( error ) }`, 'red', 'reset' );
        return buildResponse( 500, error, 'get' );
    }


}

export async function postPolizas( { data, schema } ) {
    try {
        const database = new DatabaseOperations( tableName, schema );
        const newRegister = validateData( data, model );
        if ( Object.keys( newRegister ).length === 0 )
            return buildResponse( 400, { message : 'Missing required fields or not valid' }, 'post' );

        newRegister.nro_poliza = null;
        newRegister.nro_dias = dateDiff( newRegister.fecha_salida, newRegister.fecha_retorno ) + 1;
        newRegister.fecha_emision = dateFormat();
        // newRegister.fecha_caducidad = data.fecha_caducidad ? data.fecha_caducidad : newRegister.fecha_retorno;
        // newRegister.observaciones = `[Poliza creada. USUARIO : ${ newRegister.username }],`;
        // newRegister.modificaciones = 0;
        delete newRegister.username;
        const response = await database.create( newRegister, keyField );
        return response;
    
    } catch ( error ) {
        console.log(error);
        colorLog( ` POST POLIZAS ERROR:  ${ JSON.stringify( error ) }`, 'red', 'reset' );
        return buildResponse( 500, error, 'post' );
    }
}