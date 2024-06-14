/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/** 
 * 
 * Databases Class to handle conexion
 * 
*/

// Dependencies
import { colorLog } from './helpers.mjs';
import mysql from 'mysql';

export class ErrorDB {
    constructor( error ) {
        this.message = typeof( error ) === 'object' ? JSON.stringify( error ) : error;
    }
    toString() { return `Database error: ${ this.message }`; }
}

function exportPool( schema ) {
    const pool = mysql.createPool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: schema, // Assuming DB_NAME is used for the schema/database name
        password: process.env.DB_PASS,
        port: process.env.DB_PORT
    });

    return pool;
}
            
export function executeMysql( sql, schema, fields = [] ) {
    const pool = exportPool( schema );
    return new Promise( ( resolve, reject ) => {
        pool.getConnection( ( error, connection ) => {
            if ( error ) {
                reject( new ErrorDB( error ) );
            }
            connection.query( sql, fields, ( error, result ) => {
                connection.release();
                connection.destroy();
                if ( error ) {
                    reject( error );
                }
                resolve( result );
            } );
        } );
    } );
}

export class DatabaseOperations {
    constructor( table, schema ) {
        this.table = table;
        this.schema = schema;
        const pgPool = exportPool( schema );
        this.func = process.env.DB === 'postgres' ? pgPool.query : process.env.DB === 'mysql' ? executeMysql : false;
    }
    async create( data, keyField ) {
        try {
            Object.keys( data ).forEach( key => { if ( data[ key ] === null || data[ key ] === undefined ) delete data[ key ]; } );
            const sql = QueryBuilder.insert( data, this.table, keyField );
            if ( !this.func )
                throw new ErrorDB( 'The conexion parameters are wrong!' );
            const response = this.func && await this.func( sql, this.schema, Object.values( data ) );
            return response;
        } catch ( error ) {
            colorLog( `CREATE ${ this.table } ERROR:` );
            colorLog( error instanceof ErrorDB ? error.toString() : error );
            return error instanceof ErrorDB ? error.toString() : error;
        }
    }
    async read( data = {} ) {
        try {
            const sql = QueryBuilder.filter( data, this.table );
            if ( !this.func )
                throw new ErrorDB( 'The conexion parameters are wrong!' );
            const response = this.func && await this.func( sql, this.schema );
            return response;
        } catch ( error ) {
            colorLog( `READ ${ this.table } ERROR:` );
            colorLog( error instanceof ErrorDB ? error.toString() : error );
            return error instanceof ErrorDB ? error.toString() : error;
        }
    }
    async update( data, where ) {
        try {
            Object.keys( data ).forEach( key => { if ( data[ key ] === null || data[ key ] === undefined ) delete data[ key ]; } );
            const sql = QueryBuilder.update( data, this.table, where );
            if ( !this.func )
                throw new ErrorDB( 'The conexion parameters are wrong!' );
            const response = this.func && await this.func( sql, this.schema, Object.values( data ) );
            return response;
        } catch ( error ) {
            colorLog( `UPDATE ${ this.table } ERROR:` );
            colorLog( error instanceof ErrorDB ? error.toString() : error );
            return error instanceof ErrorDB ? error.toString() : error;
        }
    }
    async delete( id, keyField ) {
        try {
            const sql =  `delete from ${ this.table } where ${ keyField } = ${ process.env.DB === 'postgres' ? '$1' : '?' }`;
            if ( !this.func )
                throw new ErrorDB( 'The conexion parameters are wrong!' );
            const response = this.func && await this.func( sql, this.schema, [ id ] );
            return response;
        } catch ( error ) {
            colorLog( `DELETE ${ this.table } ERROR:` );
            colorLog( error instanceof ErrorDB ? error.toString() : error );
            return error instanceof ErrorDB ? error.toString() : error;
        }
    }
}

const QueryBuilder = {
    insert : ( data, tableName, keyField ) => {    
        const values = process.env.DB === 'postgres' ?  Object.values( data ).map( ( key, idx ) => key !== undefined && `$${ idx + 1 }` ).join( ',' )
            :  Object.values( data ).map( key => ( typeof key === 'string' ? `'${ key }'` : key ) ).join( ',' );
        const keys = Object.keys( data ).join( ',' );
        const insert = process.env.DB === 'postgres' ? `insert into ${ tableName } ( ${ keys } ) values ( ${ values } ) returning ${ keyField }`
            : `insert into ${ tableName } ( ${ keys } ) values ( ${ values } ) `;

        return insert;
    },
    update : ( data, tableName, where = false ) => {
        const updateFileds = Object.keys( data );
        let conditions = '';
        let updater = '';
        if ( where ) {
            const conditionKeys = Object.keys( where ).filter( element => element );
            const conditionValues = Object.values( where ).filter( element => element ).map( value => ( typeof value === 'string' ? `'${ value }'` : value ) );
            conditionKeys.forEach( ( key, index ) => {
                conditions += `${ key } = ${ conditionValues[ index ] }${ index === conditionKeys.length - 1 ? ' ' : ' and ' }`;
            } );
        }
        updateFileds.forEach( ( key, index ) => {
            process.env.DB === 'postgres' ? updater += `${ key } = $${ index + 1 }, ` : updater += typeof data[ key ] === 'string' ? `${ key } = '${ data[ key ] }', ` : `${ key } = ${ data[ key ] }, `;
        });
        updater = updater.substring( 0, updater.length - 2 );
        const update = conditions ? `update ${ tableName } set ${ updater } where ${ conditions }` : `update ${ tableName } set ${ updater }`;

        return update;
    },
    filter : ( { columns = false, where = false }, tableName ) => {
        let conditions = '';  
        if ( where ) {
            Object.keys( where ).forEach( key => { if ( where[ key ] === null || where[ key ] === undefined ) delete where[ key ]; } );
            const conditionKeys = Object.keys( where );
            const conditionValues = Object.values( where ).map( value => ( typeof value === 'string' ? `'${ value }'` : value ) );
            conditionKeys.forEach( ( key, index ) => {
                conditions += `${ key } = ${ conditionValues[ index ]}${ index === conditionKeys.length - 1 ? '' : ' and ' }`;
            });
        }  
        const query = conditions ? `select ${ columns ? columns.join() : '*' } from ${ tableName } where ${ conditions }` : `select ${ columns ? columns.join() : '*' } from ${ tableName }`;

        return query;
    },
};

// const pool = process.env.DB === 'postgres' ? process.env.DB_USER && process.env.DB_HOST && process.env.DB_DATABASE && process.env.DB_PASS && process.env.DB_PORT ? new Pool( {
//     user : process.env.DB_USER,
//     host : process.env.DB_HOST,
//     database : process.env.DB_DATABASE,
//     password : process.env.DB_PASS,
//     port : process.env.DB_PORT
// } ) : false 
//     : process.env.DB === 'mysql' ? process.env.DB_USER && process.env.DB_HOST && process.env.DB_DATABASE && process.env.DB_PASS && process.env.DB_PORT ? mysql.createPool( {
//         user : process.env.DB_USER,
//         host : process.env.DB_HOST,
//         database : process.env.DB_DATABASE,
//         password : process.env.DB_PASS,
//         port : process.env.DB_PORT
//     } ) : false 
//         : process.env.DB === 'mongo' ? process.env.DB_HOST && process.env.DB_DATABASE ? new MongoClient( process.env.DB_HOST, {
//             useUnifiedTopology: true
//         } ) : false 
//             : false;

// export function executeMongo() {
//     return new Promise( ( resolve, reject ) => {
//         pool.connect().then( () => {
//             const dbo = pool.db( process.env.DB_DATABASE );
//             resolve( dbo );    
//         }).catch( error => {
//             reject( error );
//         } );
//     } );
// }

// const func = process.env.DB === 'postgres' ? pool.query : process.env.DB === 'mysql' ? executeMysql : false;

// export async function executeSql( sql, params = [] ) {
//     try {
//         if ( !pool )
//             throw new ErrorDB( 'The conexion parameters are wrong!' );
//         const response = func && await func( sql );
//         return response;
//     } catch ( error ) {
//         colorLog( 'EXECUTE SQL ERROR: ' );
//         colorLog( error instanceof ErrorDB ? error.toString() : error );
//         return error instanceof ErrorDB ? error.toString() : error;
//     }
// }

