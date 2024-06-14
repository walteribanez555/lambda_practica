import { buildResponse } from "../utils/helpers.mjs";



export async function getCoberturas({ id, schema }){

    try{
        return buildResponse(200, 'respuesta', 'get');
    }catch( error ){
        return buildResponse(500, error, 'get');
    }

}



