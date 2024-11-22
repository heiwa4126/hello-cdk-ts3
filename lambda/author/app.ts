import type { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";

export const lambdaHandler = async (
	event: APIGatewayProxyEvent,
	context: Context,
): Promise<APIGatewayProxyResult> => {
	const { name, age } = JSON.parse(event.body || "{}");

	// API Gatewayでvalidateしてるので不要
	// if (!name || !age) {
	// 	return {
	// 		statusCode: 400,
	// 		body: JSON.stringify({ message: "Invalid input" }),
	// 	};
	// }

	return {
		statusCode: 200,
		body: JSON.stringify({
			success: true,
			message: `${name} is ${age}`,
		}),
	};
};
