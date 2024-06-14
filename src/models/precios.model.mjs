// Dependencies
import { DatabaseOperations } from '../utils/database.mjs';
import { buildResponse, validateData, colorLog } from '../utils/helpers.mjs';
const tableName = 'precios';
const keyField = 'precio_id';
const model = {
    servicio_id : 'number',
    precio : 'number',
    limite_inferior : 'number',
    limite_superior : 'number',
    pendiente : 'number',
    intercepto : 'number',
    tipo_ecuacion : 'number'
};
