import cdk from "aws-cdk-lib";
import * as apigw from "aws-cdk-lib/aws-apigateway";
// import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction, OutputFormat } from "aws-cdk-lib/aws-lambda-nodejs";
import * as logs from "aws-cdk-lib/aws-logs";
import type { Construct } from "constructs";

export class HelloCdkTs3Stack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		//---- Define a lambda function
		const helloLambda = this.makeNodeLambda("hello");
		const goodbyeLambda = this.makeNodeLambda("goodbye");
		const authorLambda = this.makeNodeLambda("author");

		//---- Define API gateway
		const gw = new apigw.RestApi(this, "apigw", {
			restApiName: "Hello Service",
			description: "This service serves hello.",
		});

		const authorRequestModel = gw.addModel("AuthorRequestModel", {
			contentType: "application/json",
			modelName: "AuthorRequest",
			schema: {
				schema: apigw.JsonSchemaVersion.DRAFT7,
				type: apigw.JsonSchemaType.OBJECT,
				properties: {
					name: {
						type: apigw.JsonSchemaType.STRING,
						minLength: 3,
						maxLength: 150,
						// example:が使えない
					},
					age: {
						type: apigw.JsonSchemaType.NUMBER,
						minimum: 0,
						maximum: 150,
						// example:が使えない
					},
				},
				required: ["name", "age"],
				additionalProperties: false,
			},
		});
		const authorResponseModel = gw.addModel("AuthorResponseModel", {
			contentType: "application/json",
			modelName: "AuthorResponse",
			schema: {
				schema: apigw.JsonSchemaVersion.DRAFT7,
				type: apigw.JsonSchemaType.OBJECT,
				properties: {
					success: { type: apigw.JsonSchemaType.BOOLEAN },
					message: { type: apigw.JsonSchemaType.STRING },
				},
				required: ["success", "message"],
			},
		});

		const requestBodyValidator = new apigw.RequestValidator(this, "RequestBodyValidator", {
			restApi: gw,
			// requestValidatorName: "requestBodyValidator",
			validateRequestBody: true,
		});
		gw.root.addResource("author").addMethod("POST", new apigw.LambdaIntegration(authorLambda), {
			requestModels: {
				"application/json": authorRequestModel,
			},
			requestValidator: requestBodyValidator,
			methodResponses: [
				{
					statusCode: "200",
					responseModels: {
						"application/json": authorResponseModel,
					},
				},
				{
					statusCode: "400",
					responseModels: {
						"application/json": apigw.Model.ERROR_MODEL,
					},
				},
			],
		});
		const plaintextModel = gw.addModel("PlaintextModel", {
			contentType: "text/plain",
			modelName: "Plaintext",
			schema: {
				schema: apigw.JsonSchemaVersion.DRAFT7,
				type: apigw.JsonSchemaType.STRING,
			},
		});

		const plaintextResponse = {
			methodResponses: [
				{
					statusCode: "200",
					responseModels: {
						"text/plain": plaintextModel,
					},
				},
			],
		};
		gw.root
			.addResource("hello")
			.addMethod("GET", new apigw.LambdaIntegration(helloLambda), plaintextResponse);
		gw.root
			.addResource("goodbye")
			.addMethod("GET", new apigw.LambdaIntegration(goodbyeLambda), plaintextResponse);

		new cdk.CfnOutput(this, "endpoint", {
			value: gw.url,
		});
		new cdk.CfnOutput(this, "apigw_id", {
			value: gw.restApiId,
		});
	}

	private makeNodeLambda = (functionName: string): NodejsFunction => {
		const fn = new NodejsFunction(this, `${functionName}Function`, {
			entry: `lambda/${functionName}/app.ts`,
			runtime: lambda.Runtime.NODEJS_20_X, // Provide any supported Node.js runtime
			handler: "lambdaHandler",
			bundling: {
				minify: true, // minifyオプションを有効にする
				format: OutputFormat.ESM,
				// externalModules: ["@aws-sdk/*", "date-fns"], // AWS SDKとdate-fnsは外部モジュールとして扱う
			},
			// // Roleを書かないとAWSLambdaBasicExecutionRoleを含んだRoleが勝手に作られる。
			// // 普通はこのようにRoleを作成する。
			// role: new iam.Role(this, `${functionName}Role`, {
			// 	assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
			// 	managedPolicies: [
			// 		iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole"),
			// 	],
			// 	inlinePolicies: {...}
			// }),
		});
		// Create a CloudWatch Logs Log Group for myFunction
		new logs.LogGroup(this, `${functionName}LogGroup`, {
			logGroupName: `/aws/lambda/${fn.functionName}`,
			retention: logs.RetentionDays.ONE_WEEK,
			removalPolicy: cdk.RemovalPolicy.DESTROY,
		});

		return fn;
	};
}
