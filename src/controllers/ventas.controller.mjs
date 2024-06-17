
import { getPlanes } from "../models/coberturas.model.mjs";
import { buildResponse } from "../utils/helpers.mjs";
import { getPrecios } from "./precios.controller.mjs";

export async function getVentas({id}){
    return await getPlanes({ id, schema : 'redcard'});
}



export async function postVenta({ data  } ) { 
    if( !data.fecha_salida || !data.fecha_retorno || !data.destiny || !vouchers  ){
        return buildResponse(400, {message : "Missing data"}, 'post');
    }


    const { servicio, multiviajes, nroDias, vouchers } = data;

    const precio = await redCardPrice({ schema : 'redcard', servicio, multiviajes, nroDias, cantidad : vouchers.length, tipo_descuento : 1, descuento : 0 });


    return buildResponse(200, {message : precio}, 'post');
}



const redCardPrice = async( { schema, servicio, multiviajes, nroDias, cantidad, tipo_descuento, descuento } ) => {
    try {
        const sql =  `select precio, limite_superior, limite_inferior, pendiente from precios where servicio_id = ${ servicio }`;
        const precios = await executeMysql( sql, schema );

        if ( multiviajes ) {
            const sql =  `select codigo as precio from catalogos where catalogo = 'multiviajes' and nivel = ${ servicio } and etiqueta = '${ multiviajes.duracion }'`;
            const aux_precio = await executeMysql( sql, schema );
            const aux_descuento = aux_precio.length > 0 ? tipo_descuento === 1 && descuento > 0 ? ( cantidad * parseFloat( aux_precio[0].precio ) ) * ( descuento / 100 ) : descuento : 0;
            return { aux_precio : aux_precio.length > 0 ? parseFloat( aux_precio[0].precio ) : 0, aux_descuento, fecha_caducidad : multiviajes.fecha_caducidad };
        }

        if ( nroDias < 5 ) {
            const aux_precio = precios.filter( precio => precio.limite_superior === 5 )[ 0 ].precio;
            const aux_descuento = tipo_descuento === 1 && descuento > 0 ? ( cantidad * aux_precio ) * ( descuento / 100 ) : descuento;
            return { aux_precio, aux_descuento };
        }
  
        const precioRango = precios.filter( precio =>  precio.limite_superior  <= nroDias );
        const precioSinRango = precios.filter( precio => precio.limite_inferior > precioRango[ precioRango.length - 1 ].limite_superior );
  
        const diferencia = nroDias - precioRango[ precioRango.length - 1 ].limite_superior;
        const aux = parseFloat( diferencia * precioRango[ precioRango.length - 1 ].pendiente + precioRango[ precioRango.length - 1 ].precio );
        const aux_precio = precioSinRango.length > 0 && aux > parseFloat( precioSinRango[0].precio ) ? parseFloat( precioSinRango[0].precio ) : aux;
        const aux_descuento = tipo_descuento === 1 && descuento > 0 ? ( cantidad * aux_precio ) * ( descuento / 100 ) : descuento;        

        return { aux_precio, aux_descuento };
    } catch ( error ) {
        colorLog( ` redCardPrice ERROR:  ${ JSON.stringify( error ) }`, 'red', 'reset' );
        return buildResponse( 500, error, 'get' );
    }
};