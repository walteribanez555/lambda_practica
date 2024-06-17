
import { getPlanes } from "../models/coberturas.model.mjs";
import { buildResponse } from "../utils/helpers.mjs";

export async function getVentas({id}){
    return await getPlanes({ id, schema : 'redcard'});
}



export async function postVenta({ data  } ) { 
    if( !data.fecha_salida || !data.fecha_retorno || !data.destiny || !vouchers  ){
        return buildResponse(400, {message : "Missing data"}, 'post');
    }

    return buildResponse(200, {message : "Venta creada"}, 'post');
}