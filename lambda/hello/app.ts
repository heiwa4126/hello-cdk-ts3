import type { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { plainTextlambdaHandler } from "../lib/plaintext";

export const lambdaHandler = async (
	event: APIGatewayProxyEvent,
	context: Context,
): Promise<APIGatewayProxyResult> => {
	return plainTextlambdaHandler(event, context, "Hello, World.");
};
