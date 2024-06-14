


export async function getPrecios({id, schema}){
    try{
        return buildResponse(200, 'realizado', 'get');
    }catch{
        return buildResponse(500, error, 'get');
    }
}