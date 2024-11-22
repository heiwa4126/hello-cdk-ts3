import cdk from "aws-cdk-lib";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction, OutputFormat } from "aws-cdk-lib/aws-lambda-nodejs";
import logs from "aws-cdk-lib/aws-logs";
import type { Construct } from "constructs";

export class HelloCdkTs3Stack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		//---- Define a lambda function
		const helloLambda = this.makeNodeLambda("hello");
		const goodbyeLambda = this.makeNodeLambda("goodbye");

		//---- Define API gateway
		const gw = new apigw.RestApi(this, "apigw", {
			restApiName: "Hello Service",
			description: "This service serves hello.",
		});

		gw.root.addResource("hello").addMethod("GET", new apigw.LambdaIntegration(helloLambda));
		gw.root.addResource("goodbye").addMethod("GET", new apigw.LambdaIntegration(goodbyeLambda));

		new cdk.CfnOutput(this, "endpoint", {
			value: gw.url,
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
			role: new iam.Role(this, `${functionName}Role`, {
				assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
				managedPolicies: [
					iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole"),
				],
			}),
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
