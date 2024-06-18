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


        const cuponDetail = cupon.nombre.split('-');
        const cuponApi = cuponDetail[cuponDetail.length - 1];




      if (
        cupon.fecha_desde <= currentDate &&
        cupon.fecha_hasta >= currentDate &&
        cuponApi === 'api'
        
      ) {
        return true;
      }
      return false;
    }).map( cupon => {

        const cuponDetails = JSON.parse(cupon.oficina_id);

        cupon.description = cuponDetails.description;

        delete cupon.oficina_id;
        return cupon;

    })

    return responseFiltered;
  } catch (error) {
    throw error;
  }
}



