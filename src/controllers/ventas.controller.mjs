import { buildResponse } from "../utils/helpers.mjs";
import { executeMysql } from "../utils/database.mjs";
import { getCupones } from "../models/cupones.model.mjs";
import { postVentas } from "../models/ventas.model.mjs";
import { postPolizas } from "../models/polizas.model.mjs";
import { postBeneficiarios } from "../models/beneficiarios.model.mjs";
import { postPolizasExtras } from "../models/polizasExtras.mjs";

export async function getVentas({ id }) {
  return await getVentas({ id, schema: "redcard" });
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

  const {
    servicio,
    multiviajes,
    vouchers,
    fecha_salida,
    fecha_retorno,
    destiny,
    extras,
  } = data;

  const currentDate = new Date();
  const extraItems = [];

  const descuentos = await getCupones({ schema: "redcard", id: servicio });

  const descuentosFiltered = descuentos.filter((descuento) => {
    // if(descuento.oficina_id === null || descuento.oficina_id=== undefined ) return null;

    if (descuento.oficina_id == null || descuento.oficina_id.length == 0)
      return null;

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

  const initalDate = new Date(fecha_salida);
  const finalDate = new Date(fecha_retorno);
  const nroDias = (finalDate - initalDate) / (1000 * 60 * 60 * 24) + 1;
  const price = await redCardPrice({
    schema: "redcard",
    servicio,
    multiviajes: multiviajes !== undefined ? multiviajes : null,
    nroDias,
    cantidad: 1,
    tipo_descuento: 2,
    descuento: 0,
  });

  if (
    extras !== undefined &&
    extras.length > 0
  ) {
    for (const extra of extras) {
      const extraAmount = await extraSubTotal({
        schema: "redcard",
        extra,
        total: price.aux_precio,
      });
      extraItems.push({ extraAmount, extra });
    }
  }



  const descuentoTotal =
    multiviajes != undefined && multiviajes != null
      ? 0
      : descuentosFiltered.reduce(
          (acc, descuento) =>
            acc +
            (descuento.tipo_valor == 1
              ? parseFloat(price.aux_precio) *
                (parseFloat(descuento.valor) / 100)
              : parseFloat(descuento.valor)),
          0
        );

  const totalPagar =
    price.aux_precio -
    descuentoTotal +
    extraItems.reduce((acc, extra) => acc + extra.extraAmount, 0);


  for (const voucher of vouchers) {
    const nuevaVenta = {
      office_id: 1,
      username: "walteribanez555@gmail.com",
      cliente_id: 29,
      tipo_venta: 5,
      forma_pago: 1,
      fecha_venta: currentDate.toISOString().split("T")[0],
      cantidad: `${1}`,
      precio: `${price.aux_precio}`,
      total: `${price.aux_precio}`,
      plus: extraItems.reduce((acc, extra) => acc + extra.extraAmount, 0),
      tipo_descuento: `${2}`,
      descuento: `${descuentoTotal}`,
      tipo_valor: 1,
      descuento_extra: 0,
      total_pago: `${totalPagar}`,
      status: 2,
      comision: 0,
    };

    const extrasRequests = [];


    const venta = await postVentas({ data: nuevaVenta, schema: "redcard" });

    const venta_id = venta.response.insertId;

    const nuevaPoliza = {
      venta_id,
      servicio_id: servicio,
      destino: destiny,
      fecha_salida,
      fecha_retorno,
      extra: 0,
      status: 2,
      username: "walteribanez555@gmail.com",
    };

    const poliza = await postPolizas({ data: nuevaPoliza, schema: "redcard" });

    const poliza_id = poliza.insertId;

    const nuevoBeneficiario = {
      poliza_id,
      primer_apellido: voucher.apellidos,
      segundo_apellido: "0",
      primer_nombre: voucher.nombres,
      segundo_nombre: "0",
      nro_identificacion: voucher.nro_identificacion,
      fecha_nacimiento: voucher.fecha_nacimiento,
      sexo: voucher.sexo,
      origen: voucher.origen,
      email: voucher.email,
      telefono: voucher.telefono,
    };

    const beneficiario = await postBeneficiarios({
      data: nuevoBeneficiario,
      schema: "redcard",
    });


    for ( const extra of extraItems ) {
      const poliza_extra = {
        venta_id,
        beneficio_id: extra.extra,
        monto_adicional: extra.extraAmount,
      };

      await postPolizasExtras({ data: poliza_extra, schema: "redcard" });
    }




    voucher.voucher_id = poliza_id;
    voucher.venta_id = venta_id;
  }

  return buildResponse(
    200,
    {
      vouchers,
      currentDate: currentDate.toISOString().split("T")[0],
      precio: price.aux_precio,
      plus: extraItems.reduce((acc, extra) => acc + extra.extraAmount, 0),
      descuento: descuentoTotal,
      totalPagar: totalPagar * vouchers.length,
    },
    "post"
  );
}

const extraSubTotal = async ({ schema, extra, total }) => {
  try {
    const sql = `select tipo_valor, incremento from extras where beneficio_id = ${extra}`;

    const extras = await executeMysql(sql, schema);
    const aus_extra =
      extras[0].tipo_valor === 1
        ? total * (extras[0].incremento / 100)
        : extras[0].incremento;
    return aus_extra;
  } catch (error) {
    colorLog(` extraSubTotal ERROR:  ${JSON.stringify(error)}`, "red", "reset");
    return buildResponse(500, error, "get");
  }
};

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
