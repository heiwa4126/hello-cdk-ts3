#!/usr/bin/env node

import cdk from "aws-cdk-lib";
import "source-map-support/register";
import { HelloCdkTs2Stack } from "../lib/hello-cdk-ts2-stack";

const app = new cdk.App();

new HelloCdkTs2Stack(app, "HelloCdkTs2", {
	//  If you don't specify 'env', this stack will be environment-agnostic.
	//  Account/Region-dependent features and context lookups will not work,
	//  but a single synthesized template can be deployed anywhere.
	//
	//  Uncomment the next line to specialize this stack for the AWS Account
	//  and Region that are implied by the current CLI configuration.
	//  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
	//
	//  Uncomment the next line if you know exactly what Account and Region you
	//  want to deploy the stack to.
	//  // env: { account: '123456789012', region: 'us-east-1' },
	//
	//  For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html
	/*
		上記の日本語訳
	*/
	//  もし 'env' を指定しない場合、このスタックは環境に依存しません。
	//  アカウント/リージョンに依存する機能やコンテキストの検索は機能しませんが、
	//  1つの合成テンプレートはどこでもデプロイできます。
	//
	//  現在のCLIの設定によって暗示されるAWSアカウントとリージョンに
	//  このスタックを特化させるには、次の行のコメントを解除してください。
	//  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
	//
	//  スタックをデプロイするアカウントとリージョンを正確に知っている場合は、
	//  次の行のコメントを解除してください。
	//  // env: { account: '123456789012', region: 'us-east-1' },
	//
	//  詳細は、https://docs.aws.amazon.com/ja_jp/cdk/latest/guide/environments.html を参照してください。
});
