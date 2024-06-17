import { getPolizas } from "../models/polizas.model.mjs";


export async function getVoucher({id}){
    return getPolizas({ id, schema : 'redcard'});
}