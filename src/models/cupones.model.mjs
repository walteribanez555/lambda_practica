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

    const currentDate = new Date();

    const responseFiltered = response.filter((cupon) => {


        const cuponDetail = cupon.name.split('-');
        const cuponApi = cuponDetail[cuponDetail.length - 1];




      if (
        cupon.fecha_desde <= currentDate &&
        cupon.fecha_hasta >= currentDate &&
        cuponApi === 'api'
        
      ) {
        return true;
      }
      return false;
    });

    return buildResponse(200, responseFiltered, "get");
  } catch (error) {
    colorLog(` GET CUPONES ERROR:  ${JSON.stringify(error)}`, "red", "reset");
    return buildResponse(500, error, "get");
  }
}

export async function postCupones({ data, schema }) {
  try {
    const database = new DatabaseOperations(tableName, schema);
    const newRegister = validateData(data, model);
    if (Object.keys(newRegister).length === 0)
      return buildResponse(
        400,
        { message: "Missing required fields or not valid" },
        "post"
      );

    const response = await database.create(newRegister, keyField);
    return buildResponse(200, response, "post", keyField, data);
  } catch (error) {
    colorLog(` POST CUPONES ERROR:  ${JSON.stringify(error)}`, "red", "reset");
    return buildResponse(500, error, "post");
  }
}

export async function putCupones({ id, data, schema }) {
  try {
    const database = new DatabaseOperations(tableName, schema);
    const update = validateData(data, model, "put");

    if (Object.keys(update).length === 0)
      return buildResponse(400, { message: "Missing fields to update" }, "put");

    if (!id)
      return buildResponse(
        400,
        { message: "Missing the record id to update" },
        "put"
      );

    const where = {
      [keyField]: id,
    };
    const response = await database.update(update, where);
    return buildResponse(200, response, "put");
  } catch (error) {
    colorLog(` PUT CUPONES ERROR:  ${JSON.stringify(error)}`, "red", "reset");
    return buildResponse(500, error, "put");
  }
}

export async function deleteCupones({ id, schema }) {
  try {
    const database = new DatabaseOperations(tableName, schema);
    if (!id)
      return buildResponse(
        400,
        { message: "Missing the record id to delete" },
        "delete"
      );

    await database.delete(id, keyField);
    return buildResponse(200, { message: "Register deleted!" }, "delete");
  } catch (error) {
    colorLog(
      ` DELETE CUPONES ERROR:  ${JSON.stringify(error)}`,
      "red",
      "reset"
    );
    return buildResponse(500, error, "delete");
  }
}
