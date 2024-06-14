/* eslint-disable no-undef */
/* eslint-disable no-console */
/* eslint-disable no-prototype-builtins */
/**
 * 
 * Helpers for various tasks
 * 
 */

// Dependencies
import fs from 'fs';
const fsPromises = fs.promises;
import path from 'path';
import crypto from 'crypto';
import url from 'url';

const day = new Date();
const templateGlobals = {
    appName : 'Platform',
    companyName : 'BearSoft',
    company : 'BearSoft',
    yearCreated : day.getFullYear()
};

export function age( birthDate ) {
    const currentYear = parseInt( day.getFullYear() );
    const currentMonth = parseInt( day.getMonth() + 1 );
    const currentDay = parseInt( day.getDate() );
    const birthYear = parseInt( String( birthDate ).substring( 0, 4 ) );
    const birthMonth = parseInt( String( birthDate ).substring( 5, 7 ) );
    const birthDay = parseInt( String( birthDate ).substring( 8, 10 ) );
    let years = currentYear - birthYear;
    if ( currentMonth < birthMonth || ( currentMonth === birthMonth && currentDay < birthDay ) )
        years--;
    return years;
}

export function dateDiff( dateStart, dateEnd ) {
    const arrayStart = dateStart.split( '-' );
    const arrayEnd = dateEnd.split( '-' );
    const dateS = Date.UTC( arrayStart[ 0 ], arrayStart[ 1 ] - 1, arrayStart[ 2 ] );
    const dateE = Date.UTC( arrayEnd[ 0 ], arrayEnd[ 1 ] - 1, arrayEnd[ 2 ] );
    const diff = Math.floor( ( dateE - dateS ) / (1000 * 60 * 60 * 24));
    return diff;
}

export function hash( str ) {
    const hash = typeof( str ) === 'string' && str.length > 0 ? crypto.createHmac( 'sha256', 'thisIsASecret' ).update( str ).digest( 'hex' ) : false;
    return hash;
}

export function querystringToJsonObject( str ) {
    return ( str && str.length > 0 ? url.parse( str, true ).query : {} );
}

export function createRandomString( strLength ) {
    strLength = typeof( strLength ) === 'number' && strLength > 0 ? strLength : false;
    if ( !strLength )
        return false;
    const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let str = '';
    for ( let i = 1; i <= strLength; i++ ) {
        const randomCharacter = possibleCharacters.charAt( Math.floor( Math.random() * possibleCharacters.length ) );
        str += randomCharacter;
    }
    return str;
}

export function parseJsonToObject( str ) {
    return ( str && str.length > 0 ? JSON.parse( str ) : {} );
}

export function validateEmail( emailAddress ) {
    const regExp = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    return regExp.test( emailAddress ) ? true : false;
}

export function dateFormat() {
    const toDay = `${ day.getFullYear() }-${ ('0' + ( day.getMonth() + 1 ) ).slice( -2 ) }-${ ( '0' + day.getDate() ).slice( -2 ) }T${ ( '0' + day.getHours() ).slice( -2 ) }:${ ( '0' + day.getMinutes() ).slice( -2 ) }:${ ( '0' + day.getSeconds() ).slice( -2 ) }`;
    return toDay;
}

export function dateNow() {
    const day = new Date();
    const toDay = `${ day.getFullYear() }-${ ( '0' + ( day.getMonth() + 1 ) ).slice( -2 ) }-${ ( '0' + day.getDate() ).slice( -2 ) }`;
    return toDay;
}

export function hourNow() {
    const toDay = `${ ( '0' + day.getHours() ).slice( -2 ) }:${ ( '0' + day.getMinutes() ).slice( -2 ) }:${ ( '0' + day.getSeconds() ).slice( -2 ) }`;
    return toDay;
}

// Function to transform any string from Base64 encoding to utf-8
export function utf8ToBase64( data ) {
    const buff = new Buffer.from( data );
    return buff.toString( 'base64' );
}

export function base64ToUtf8( data ){
    const buff = new Buffer.from( data, 'base64' );
    return buff.toString( 'utf8' );
}

export function toCamelCase( str ) {
    str = str.toLowerCase().replace(/(?:(^.)|([-*&%_\s]+.))/g, match => match.charAt( match.length-1 ).toUpperCase() );
    return str.charAt( 0 ).toLowerCase() + str.substring( 1 );
}

export async function fileToBase64( dir, fileName, local = true ) {
    const route = local ? `${ path.join( __dirname, dir ) }`: dir;
    const data = await fsPromises.readFile( `${ route }/${ fileName }` );
    return data.toString( 'base64' );
}

// Get the string content of a template
export async function getTemplate( templateName ) {
    templateName = typeof( templateName ) === 'string' && templateName.length > 0 ? templateName : false;
    if ( !templateName ) 
        return { response : false, message : 'A valid template name was not specified' };
    const templatesDir = path.join( __dirname, '/../pages/' );
    const str = await fsPromises.readFile( `${ templatesDir }${ templateName }.html`, 'utf-8' );
    return str;
}

// Take a given string and data object, and find/replace all the keys within it
export function interpolate( str, data ) {
    str = typeof( str ) === 'string' && str.length > 0 ? str : '';
    data = typeof( data ) === 'object' && data !== null ? data : {};
    // Add the templateGlobals to the data object, prepending their key name with "global."
    for ( let keyName in templateGlobals ) {
        data[ `global.${ keyName }` ] = templateGlobals[ keyName ];
    }
    // For each key in the data object, insert its value into the string at the corresponding placeholder
    for ( let key in data ) {
        if ( data.hasOwnProperty( key ) && typeof( data[ key ] === 'string' ) ) {
            let replace = data[ key ];
            let find = `{${ key }}`;
            str = str.replace( find, replace );
        }
    }
    return str;
}

export function colorLog( message, color = false, style = false ) {
    const colors = {
        black : '\x1b[30m',
        red : '\x1b[31m',
        green : '\x1b[32m',
        yellow : '\x1b[33m',
        blue : '\x1b[34m',
        magenta : '\x1b[35m',
        cyan : '\x1b[36m',
        white : '\x1b[37m',
    };
    const styles = {
        reset : '\x1b[0m',
        bright : '\x1b[1m',
        dim : '\x1b[2m',
        underscore : '\x1b[4m',
        blink : '\x1b[5m',
        reverse : '\x1b[7m',
        hidden : '\x1b[8m',
    };
    const msgColor = color && typeof( colors[ color ] ) === 'string' ? colors[ color ] : false;
    const msgStyle = style && typeof( styles[ style ] ) === 'string' ? styles[ style ] : false;
    console.log( msgColor && msgStyle ? `${ msgColor }%s${ msgStyle }  ` : '', message );
}

// Create and write data into a file
export async function createFile( { dir, file, data, ext, local = true } ) {
    let fileDescriptor;
    const route = local ? `${ path.join( __dirname, dir ) }`: dir;
    try {
        fileDescriptor = await fsPromises.open( `${ route }/${ file }.${ ext }`, 'wx' );
        const stringData = ext === 'json' ? JSON.stringify( data ) : data;
        await fsPromises.writeFile( fileDescriptor, stringData );
        return true;
    } catch( error ) {
        return error;
    } finally {
        if ( fileDescriptor !== undefined ) 
            await fileDescriptor.close();
    }
}

// Read file
export async function readFile( { dir = '', file, ext, local = true } ) {
    const parseJsonToObject = str => {
        return ( str && str.length > 0 ? JSON.parse( str ) : {} );
    };
    const route = local ? `${ path.join( __dirname, dir ) }`: dir;
    try {
        const data = await fsPromises.readFile( `${ route }/${ file }.${ ext }`, 'utf-8' );
        const stringData = ext === 'json' ? parseJsonToObject( data ) : data;
        return stringData;
    } catch( error ) {
        return error;
    }
}

// Delete a file
export async function deleteFile( { dir = '', file, ext, local = true } ) {
    const route = local ? `${ path.join( __dirname, dir ) }`: dir;
    try {
        await fsPromises.unlink( `${ route }/${ file }.${ ext }` );
        return true;
    } catch( error ) {
        return error;
    }
}

export function validateData( data, model, type = 'post' ) {
    const keys = Object.keys( data );
    const values = Object.values( data );
    const modelKeys = Object.keys( model );
    const validModel = {};
    for ( let i = 0; i < keys.length; i++ ) {
        if ( modelKeys.includes( keys[ i ] ) ) {
            validModel[ keys[ i ] ] = typeof( values[ i ] ) === 'string' && values[ i ].trim().length > 0 ? values[ i ].trim()
                : typeof( values[ i ] ) === 'number' ? values[ i ]
                    : typeof( values[ i ] ) === 'object' && values[ i ] instanceof Array && values[ i ].length > 0 ? values[ i ] : false;
        }
    }    
    const validation = Object.values( validModel );
    if ( type === 'post' && ( validation.length !== Object.keys( model ).length ) ) 
        return false;
    if ( type === 'put' && ( !validation.some( elem => elem ) || validation.length === 0 ) )
        return false;

    return validModel;
}

export function buildResponse ( statusCode, body, method, id = 'id', register = {} ) {
    const response = method === 'get' ? body?.rows ? body.rows : body 
        : method === 'post' ? body.rows && body.rows.length > 0 && body.rows[ 0 ][ id ] ? { id : body.rows[ 0 ][ id ], ...register } : body.insertId ? { id : body.insertId, ...register } : body 
            : method === 'put' ? body?.rowCount ? { affectedRows : body.rowCount } : body?.affectedRows ? { affectedRows : body.affectedRows } : body
                : method === 'delete' ? body?.rowCount ? { affectedRows : body.rowCount } : body?.affectedRows ? { affectedRows : body.affectedRows } : body
                    : method === 'other' ? body 
                        : { message : 'No hay resultado para mostrar' };
    return { 
        statusCode,
        headers : {
            'Content-Type' : 'application/json',
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Methods' : 'OPTIONS, POST, GET, PUT, DELETE',
            'Access-Control-Allow-Headers' : 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, apitoken, Access-Control-Allow-Request-Method'
        },
        body : JSON.stringify( response )
    };
}
