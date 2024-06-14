import { DatabaseOperations, executeMysql } from '../utils/database.mjs';
import { buildResponse, validateData, colorLog, dateFormat, dateDiff } from '../utils/helpers.mjs';

const tableName = 'polizas';
const keyField = 'poliza_id';

const model = {
    venta_id : 'number',
    servicio_id : 'number',
    destino : 'string',
    fecha_salida : 'string',
    fecha_retorno : 'string',
    multiviaje : 'number',
    extra : 'number',
    status : 'number', 
    username : 'string',
};