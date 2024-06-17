import { getServicios } from "../models/servicios.model.mjs";

export async function getPlanes({id}){
    return getServicios({ id, schema : 'redcard'});
}