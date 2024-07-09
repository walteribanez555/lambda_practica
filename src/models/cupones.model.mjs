/**
 *
 * cupones function
 *
 */

// Dependencies
import { DatabaseOperations } from "../utils/database.mjs";
import { buildResponse, validateData, colorLog } from "../utils/helpers.mjs";
const tableName = "cupones";
const keyField = "servicio_id";
const model = {
  servicio_id: "number",
  tipo_valor: "number",
  nombre: "string",
  valor: "number",
  fecha_desde: "string",
  fecha_hasta: "string",
  status: "number",
};

export async function getCupones({ id, schema }) {
  try {
    const database = new DatabaseOperations(tableName, schema);
    const data = {
      where: {
        [keyField]: id,
      },
    };
    const response = await database.read(data);
    return response;
  } catch (error) {
    colorLog(` GET CUPONES ERROR:  ${JSON.stringify(error)}`, "red", "reset");
    return buildResponse(500, error, "get");
  }
}
