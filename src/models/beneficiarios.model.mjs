import { DatabaseOperations } from '../utils/database.mjs';
import { buildResponse, validateData, colorLog, age } from '../utils/helpers.mjs';

const tableName = 'beneficiarios';
const idField = 'beneficiario_id';
const keyField = 'poliza_id';

const model = {
    poliza_id : 'number',
    primer_apellido : 'string',
    segundo_apellido : 'string',
    primer_nombre : 'string',
    segundo_nombre : 'string',
    nro_identificacion : 'string',
    fecha_nacimiento : 'string',
    sexo : 'number',
    origen : 'string',
    email : 'string',
    telefono : 'string'
};

