import type { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";

export const plainTextlambdaHandler = async (
	event: APIGatewayProxyEvent,
	context: Context,
	body: string,
): Promise<APIGatewayProxyResult> => {
	return {
		statusCode: 200,
		headers: {
			"Content-Type": "text/plain",
		},
		body,
	};
};
