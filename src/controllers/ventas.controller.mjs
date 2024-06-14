
import { getPlanes } from "../models/coberturas.model.mjs";
import { buildResponse } from "../utils/helpers.mjs";

export async function getVentas({id}){
    return await getPlanes({ id, schema : 'redcard'});
}