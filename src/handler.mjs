export const handler = async (event) => {
    console.log( 'Main Fecha-Hora: ', new Date() );
    console.log( 'EVENT: ' , event );
    const { method, path } = event?.requestContext?.http ? event.requestContext.http : {};
    const { id } = typeof( event.queryStringParameters ) === 'object' && Object.keys( event.queryStringParameters ).length > 0 ? event.queryStringParameters : false;
    const data = typeof( event.body ) === 'string' && Object.keys( parseJsonToObject( event.body ) ).length > 0 ? parseJsonToObject( event.body ) : {};
    console.log( 'DATA: ' , data );
    console.log( 'ID: ' , id );
    console.log( 'METHOD: ' , method.toLowerCase() );
    console.log( 'PATH: ' , path );
    // Your Lambda function code
    return {
        statusCode: 200,
        body: JSON.stringify('Segunda prueba' + path),
    };
};