import { getPolizas } from "../models/polizas.model.mjs";

export async function getVoucher({ id }) {
  if (!id) {
    return buildResponse(500, "voucher number required", "get");
  }

  return await getPolizas({ id, schema: "redcard" });
}
