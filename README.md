# hello-cdk-ts2

[Run Bun Run! Building an AWS CDK Template with Bun - DEV Community](https://dev.to/jolodev/run-bun-run-building-an-aws-cdk-template-with-bun-4nak)
を参考にして、
Bun にした
[AWS CDK v2 チュートリアル](https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/hello_world.html) TypeScript 版。

## 手順

```sh
bun i
bun run layer # ./layers/を作って ./node_modulesからsymlinkを張る
bun run list  # "HelloCdkTs2"
bun run bootstrap # 一度もCDKを実行したことのないリージョンではこれを実行。CloudFormationにスタックCDKToolkitができる。二度やっても大丈夫
bun run synth > tmp.yml # (オプション) tmp.ymlにCloudFormationが出る。チェック用
bun run deploy
#
bun run diff
bun run destroy
```

`cdk build` 相当が不要。

## TODO

- ✅lambda を外出しにする
- ✅LogGroup をスタックに追加する
- ✅CloudWatch のロググループが残るのを治す。
- ✅いま mjs で書いてる lambda を ts にして、パッケージ依存もやる前処理を書く → NodejsFunction()を使えば esbundle がよしなにやってくれる
- ✅Terraform の output サブコマンド相当のが欲しい。 [Command: output | Terraform | HashiCorp Developer](https://developer.hashicorp.com/terraform/cli/commands/output) → `bun run deploy` で ./outputs.json に出すようにした。run-scripts 参照。
- jest を vitest にする。
- `sam local invoke -t cdk.out/HelloCdkTs2.template.json` ができるはず。
