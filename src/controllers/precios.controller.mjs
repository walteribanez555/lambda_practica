
import { buildResponse } from "../utils/helpers.mjs";
import { getPrecios as modelGetPrecios } from "../models/precios.model.mjs";


export async function getPrecios({id}){
    
    return modelGetPrecios({ id, schema : 'redcard'})
}