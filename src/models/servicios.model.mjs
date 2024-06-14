import { DatabaseOperations } from '../utils/database.mjs';
import { buildResponse, validateData, colorLog } from '../utils/helpers.mjs';
const tableName = 'servicios';
const keyField = 'servicio_id';
const model = {
    servicio : 'string',
    descripcion : 'string',
    precio_base : 'number',
    edad_base : 'number',
    edad_limite : 'number',
    cobertura_global : 'number',
    tiempo_limite : 'number',
    cupones : 'number',
    descuento : 'number',
    moneda : 'string',
    img : 'string',
    disponibilidad : 'string',
    status : 'number'
};