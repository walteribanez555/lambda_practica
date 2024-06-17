import { executeMysql } from '../utils/database.mjs';
import { buildResponse, colorLog } from '../utils/helpers.mjs';


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