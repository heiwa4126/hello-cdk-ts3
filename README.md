# hello-cdk-ts3

[Run Bun Run! Building an AWS CDK Template with Bun - DEV Community](https://dev.to/jolodev/run-bun-run-building-an-aws-cdk-template-with-bun-4nak)
を参考にして、
Bun にした
[AWS CDK v2 チュートリアル](https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/hello_world.html) TypeScript 版。

## 手順

bun 使ってるけど pnpm や npm(遅い)でも OK.

```sh
bun i
bun run layer # ./layers/を作って ./node_modulesからsymlinkを張る
bun run list  # (オプション) "HelloCdkTs3"
bun run bootstrap # (状況によって実行) 一度もCDKを実行したことのないリージョンではこれを実行。CloudFormationにスタックCDKToolkitができる。二度やっても大丈夫
bun run synth > tmp.yml # (オプション) tmp.ymlにCloudFormationが出る。チェック用
bun run helloFunction # (オプション) デプロイ前にlambdaをローカルで実行。AWS SAMとDockerが必要
bun run deploy
#
bun run diff
bun run destroy
```

`cdk build` 相当が不要。

## TODO

- ✅lambda を外出しにする
- ✅LogGroup をスタックに追加。→追加した。LogGroup は Lambda1 個に 1 つで、無いと自動で作成される。けど、スタック管理下にないのでスタックを消しても削除されないし、expires も指定できない。あと
- ✅CloudWatch のロググループが残るのを治す。
- ✅いま mjs で書いてる lambda を ts にして、パッケージ依存もやる前処理を書く → NodejsFunction()を使えば esbundle がよしなにやってくれる
- ✅Terraform の output サブコマンド相当のが欲しい。 [Command: output | Terraform | HashiCorp Developer](https://developer.hashicorp.com/terraform/cli/commands/output) → `bun run deploy` で ./outputs.json に出すようにした。run-scripts 参照。
- ✅`sam local invoke -t cdk.out/HelloCdkTs3.template.json` ができるはず。→できた。run-script に helloFunction,goodbyeFunction として追加してある。cdk synth 後に実行可能。Docker 必要。
- POST で contents を渡して、戻り値もちゃんとスキームのある Lambda を書く。OpenAPI で APIGW で validate もする。
- jest を vitest にする。
