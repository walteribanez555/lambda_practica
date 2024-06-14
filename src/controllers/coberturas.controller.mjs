import { getPlanes } from "../models/coberturas.model.mjs";



export async function getCoberturas({ id, schema }){
    // return getPlanes({ id, schema : 'redcard' });
    try{
        return buildResponse(200, 'realizado', 'get');
    }catch{
        return buildResponse(500, error, 'get');
    }
}



