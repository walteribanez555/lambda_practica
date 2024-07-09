import { getPlanes } from "../models/coberturas.model.mjs";
import { buildResponse } from "../utils/helpers.mjs";
import { executeMysql } from "../utils/database.mjs";
import { getCupones } from "../models/cupones.model.mjs";

export async function getVentas({ id }) {
  return await getPlanes({ id, schema: "redcard" });
}

export async function postVenta({ data }) {
  if (
    !data.fecha_salida ||
    !data.fecha_retorno ||
    !data.destiny ||
    !data.vouchers
  ) {
    return buildResponse(400, { message: "Missing data" }, "post");
  }

  const { servicio, multiviajes, vouchers, fecha_salida, fecha_retorno } = data;

  const currentDate = new Date();

  // const precio = await redCardPrice({
  //   schema: "redcard",
  //   servicio,
  //   multiviajes: multiviajes,
  //   nroDias,
  //   cantidad: 1,
  //   tipo_descuento: 1,
  //   descuento: 0,
  // });

  // const descuentos =

  //   const item = {
  //     quantity: 1,
  //     daysMin: 60,
  //     countries: ["bolivia", "peru", "argentina", "chile", "mexico"],
  //   };
  const descuentos = await getCupones({ schema: "redcard", id: servicio });

  const descuentosFiltered = descuentos.filter((descuento) => {

    // if(descuento.oficina_id === null || descuento.oficina_id=== undefined ) return null;

    if(descuento.oficina_id == null || descuento.oficina_id.length == 0  ) return null;

    const policy = JSON.parse(descuento.oficina_id);
    if (
      policy === null ||
      policy.quantity == null ||
      policy.isApi == null ||
      policy.quantity == undefined ||
      policy === undefined ||
      policy.isApi == undefined 
    )
      return null;

    const initialDate = new Date(descuento.fecha_desde);
    const finalDate = new Date(descuento.fecha_hasta);

    if (
      initialDate <= currentDate &&
      finalDate >= currentDate &&
      vouchers.length % policy.quantity == 0 &&
      policy.isApi == 1
    )
      return descuento;
    return null;
  });

  initalDate = new Date(fecha_salida);
  finalDate = new Date(fecha_retorno);
  nroDias = (finalDate - initalDate) / (1000 * 60 * 60 * 24);
  const price = await redCardPrice({
    schema,
    servicio,
    multiviajes,
    nroDias,
    cantidad: 1,
    tipo_descuento: 1,
    descuento: 0,
  });



  // const descuentosFiltered = descuentos.filter((descuento) => {

  //   if(descuento.oficina_id === null || descuento.oficina_id=== undefined ) return null;

  //   // const policy  = JSON.parse(descuento.oficina_id);
  //   const initialDate = new Date(descuento.fecha_desde);
  //   const finalDate = new Date(descuento.fecha_hasta);
  //   if (
  //     initialDate <= currentDate &&
  //     finalDate >= currentDate
  //   ) {
  //     return descuento;
  //   }
  //   return null;
  // });

  // const montoDescuentoPersona = descuentosFiltered.reduce(
  //   (acc, descuento) => acc + parseFloat(descuento.valor),
  //   0
  // );

  //Crear Venta por pasajero

  //Agregar Extras por pasajero

  //Crear Poliza por pasajero

  //Crear Beneficiario por pasajero

  return buildResponse(
    200,
    {
      vouchers,
      cantidad: vouchers.length,
      descuentosFiltered,
      currentDate: currentDate.toISOString().split("T")[0],
      precio: price,
    },
    "post"
  );
}

const redCardPrice = async ({
  schema,
  servicio,
  multiviajes,
  nroDias,
  cantidad,
  tipo_descuento,
  descuento,
}) => {
  try {
    const sql = `select precio, limite_superior, limite_inferior, pendiente from precios where servicio_id = ${servicio}`;
    const precios = await executeMysql(sql, schema);

    if (multiviajes) {
      const sql = `select codigo as precio from catalogos where catalogo = 'multiviajes' and nivel = ${servicio} and etiqueta = '${multiviajes.duracion}'`;
      const aux_precio = await executeMysql(sql, schema);
      const aux_descuento =
        aux_precio.length > 0
          ? tipo_descuento === 1 && descuento > 0
            ? cantidad * parseFloat(aux_precio[0].precio) * (descuento / 100)
            : descuento
          : 0;
      return {
        aux_precio:
          aux_precio.length > 0 ? parseFloat(aux_precio[0].precio) : 0,
        aux_descuento,
        fecha_caducidad: multiviajes.fecha_caducidad,
      };
    }

    if (nroDias < 5) {
      const aux_precio = precios.filter(
        (precio) => precio.limite_superior === 5
      )[0].precio;
      const aux_descuento =
        tipo_descuento === 1 && descuento > 0
          ? cantidad * aux_precio * (descuento / 100)
          : descuento;
      return { aux_precio, aux_descuento };
    }

    const precioRango = precios.filter(
      (precio) => precio.limite_superior <= nroDias
    );
    const precioSinRango = precios.filter(
      (precio) =>
        precio.limite_inferior >
        precioRango[precioRango.length - 1].limite_superior
    );

    const diferencia =
      nroDias - precioRango[precioRango.length - 1].limite_superior;
    const aux = parseFloat(
      diferencia * precioRango[precioRango.length - 1].pendiente +
        precioRango[precioRango.length - 1].precio
    );
    const aux_precio =
      precioSinRango.length > 0 && aux > parseFloat(precioSinRango[0].precio)
        ? parseFloat(precioSinRango[0].precio)
        : aux;
    const aux_descuento =
      tipo_descuento === 1 && descuento > 0
        ? cantidad * aux_precio * (descuento / 100)
        : descuento;

    return { aux_precio, aux_descuento };
  } catch (error) {
    colorLog(` redCardPrice ERROR:  ${JSON.stringify(error)}`, "red", "reset");
    return buildResponse(500, error, "get");
  }
};
