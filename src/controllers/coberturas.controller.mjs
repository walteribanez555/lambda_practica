import { getPlanes } from "../models/coberturas.model.mjs";
// import { buildResponse } from "../utils/helpers.mjs";



export async function getCoberturas({ id}){
    return getPlanes({ id, schema : 'redcard' });
    // try{
    //     return buildResponse(200, 'realizado', 'get');
    // }catch{
    //     return buildResponse(500, error, 'get');
    // }
}



