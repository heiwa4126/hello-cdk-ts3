import cdk from "aws-cdk-lib";
import iam from "aws-cdk-lib/aws-iam";
import lambda from "aws-cdk-lib/aws-lambda";
import logs from "aws-cdk-lib/aws-logs";
import type { Construct } from "constructs";
import path from "node:path";

export class HelloCdkTs2Stack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		// Define a s3 bucket
		const myBucket = new cdk.aws_s3.Bucket(this, "MyBucket", {
			blockPublicAccess: cdk.aws_s3.BlockPublicAccess.BLOCK_ALL,
			versioned: false, // テストなのでバージョニング無効
			// ↓テストなので削除しやすくする
			removalPolicy: cdk.RemovalPolicy.DESTROY,
			autoDeleteObjects: true, // lambda(とrole)が1個増えるけど便利
		});

		const myFunction = new lambda.Function(this, "HelloS3Function", {
			runtime: lambda.Runtime.NODEJS_20_X, // Provide any supported Node.js runtime
			handler: "app.lambdaHandler",
			code: lambda.Code.fromAsset(path.join(__dirname, "..", "lambda", "hello"), {
				exclude: ["*.log", "tests/**/*"],
			}),
			role: new iam.Role(this, "HelloS3FunctionRole", {
				assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
				inlinePolicies: {
					MyBucketWriteAccess: new iam.PolicyDocument({
						statements: [
							new iam.PolicyStatement({
								actions: ["s3:PutObject"],
								resources: [`${myBucket.bucketArn}/*`],
							}),
						],
					}),
				},
			}),
			environment: {
				MyBucketName: myBucket.bucketName,
			},
		});

		// 依存を明示する練習。myFunctionがmyBucketに依存することを明示。ほとんどの場合は不要。
		myFunction.node.addDependency(myBucket);

		// Define the Lambda function URL resource
		const myFunctionUrl = myFunction.addFunctionUrl({
			authType: lambda.FunctionUrlAuthType.NONE,
		});

		// Create a CloudWatch Logs Log Group for myFunction
		const myFunctionLog = new logs.LogGroup(this, "HelloWorldFunctionLogGroup", {
			retention: logs.RetentionDays.ONE_WEEK,
			logGroupName: `/aws/lambda/${myFunction.functionName}`,
			removalPolicy: cdk.RemovalPolicy.DESTROY,
		});

		//--------------------------------------------------------------------
		// Define a CloudFormation output for your URL
		new cdk.CfnOutput(this, "MyBucketName", {
			value: myBucket.bucketName,
		});
		// Define a CloudFormation output for your URL
		new cdk.CfnOutput(this, "HelloFunctionUrl", {
			value: myFunctionUrl.url,
		});
		// Define a CloudFormation output for LogGroup
		new cdk.CfnOutput(this, "HelloFunctionLogGroup", {
			value: myFunctionLog.logGroupName,
		});
	}
}
