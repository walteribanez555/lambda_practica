import { getCupones } from "../models/cupones.model.mjs";

export async function getDescuentos({ id }) {
    return getCupones({ id, schema: 'redcard'});
}