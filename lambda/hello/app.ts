export const lambdaHandler = async (event, context) => {
	return {
		statusCode: 200,
		body: "Hello, World!",
	};
};
