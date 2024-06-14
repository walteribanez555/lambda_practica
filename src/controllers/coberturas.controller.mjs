import { getPlanes } from "../models/coberturas.model.mjs";



export async function getCoberturas({ id, schema }){
    // return getPlanes({ id, schema : 'redcard' });
    return await getPlanes({ id, schema })
}



