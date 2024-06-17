import { getPlanes } from "../models/coberturas.model.mjs";
import { buildResponse } from "../utils/helpers.mjs";



export async function getCoberturas({ id}){
    if (!id || id === "" || id === "undefined") {
        return buildResponse(400, {message : "Service id required"}, 'get');
      }
    return getPlanes({ id, schema : 'redcard' });
}



