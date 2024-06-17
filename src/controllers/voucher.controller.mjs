import { getPolizas } from "../models/polizas.model.mjs";

export async function getVoucher({ id }) {
  if (!id || id === "" || id === "undefined") {
    return buildResponse(500, {message : "Voucher number required"}, 'get');
  }

  return await getPolizas({ id, schema: "redcard" });
}
