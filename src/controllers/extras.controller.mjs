import { getExtras as modelGetExtras } from '../models/extras.model.mjs';



export async function getExtras({id}){
    return modelGetExtras({ id, schema : 'redcard'});
}