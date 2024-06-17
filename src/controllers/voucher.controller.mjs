import { getPolizas } from "../models/polizas.model.mjs";
import { buildResponse } from "../utils/helpers.mjs";

export async function getVoucher({ id }) {
  if (!id || id === "" || id === "undefined") {
    return buildResponse(400, {message : "Voucher number required"}, 'get');
  }

  return await getPolizas({ id, schema: "redcard" });
}
