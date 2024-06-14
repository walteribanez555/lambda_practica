
// Dependencies
import { executeMysql } from '../utils/database.mjs';
import { buildResponse, colorLog } from '../utils/helpers.mjs';
const tableName = 'planes';


export async function getPlanes( { id, schema } ) {
    try {

        const where = id ? `where pla.servicio_id = ${ id }` : '';
        const sql = schema === 'assist_trip' ? `select pla.cobertura, pla.moneda, pla.complemento, ben.tipo_beneficio,
        ben.descripcion as beneficio, ben.color, ben.icono, ben.beneficio_id
        from ${ tableName } pla
        inner join beneficios ben on pla.beneficio_id = ben.beneficio_id and ben.status = 1
        ${ where }` : `select distinct pla.cobertura, pla.moneda, pla.complemento, pla.extra,
        ben.tipo_beneficio, ben.descripcion as beneficio, 
        0 as incremento, ben.color, ben.icono, ben.beneficio_id
        from ${ tableName } pla
        inner join beneficios ben on pla.beneficio_id = ben.beneficio_id and ben.status = 1
        ${ where }
        union
        select distinct ext.cobertura, ext.moneda, ext.complemento, pla.extra,
        0 as tipo_beneficio, ext.descripcion as beneficio, 
        ext.incremento, ext.color, ext.icono, ext.beneficio_id
        from planes pla
        inner join extras ext on pla.beneficio_id = ext.beneficio_id and ext.status = 1
        ${ where }`;

        const result =  await executeMysql( sql, schema, [] );
        const response = result?.rows ? result.rows : result;
        return buildResponse( 200, response, 'get' );
    } catch ( error ) {
        colorLog( ` GET PLANES ERROR:  ${ JSON.stringify( error ) }`, 'red', 'reset' );
        return buildResponse( 500, error, 'get' );
    }
}
