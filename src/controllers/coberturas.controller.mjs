import { getPlanes } from "../models/coberturas.model.mjs";
import { buildResponse } from "../utils/helpers.mjs";



export async function getCoberturas({ id, schema }){
    // return getPlanes({ id, schema : 'redcard' });
    return getPlanes({ id, schema : 'redcard' })
}



