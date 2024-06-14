import { buildResponse } from "../utils/helpers.mjs";


export async function getPlanes({id, schema}){
    try{
        return buildResponse(200, 'realizado', 'get');
    }catch{
        return buildResponse(500, error, 'get');
    }
}