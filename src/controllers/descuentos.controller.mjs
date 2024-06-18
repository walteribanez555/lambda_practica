import { getCupones } from "../models/cupones.model.mjs";
import { buildResponse } from "../utils/helpers.mjs";

export async function getDescuentos({ id }) {

    try{
        const cupones = await getCupones({ id, schema: 'redcard'});
        
        return buildResponse(200, cupones, 'get')

    }catch(e){
        return buildResponse(500, {message : e}, 'get')
    }
    

}