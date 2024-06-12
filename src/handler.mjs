export const handler = async (event) => {
    // Your Lambda function code
    return {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
};