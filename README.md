# hello-cdk-ts2

[Run Bun Run! Building an AWS CDK Template with Bun - DEV Community](https://dev.to/jolodev/run-bun-run-building-an-aws-cdk-template-with-bun-4nak)
を参考にして、
Bun にした
[AWS CDK v2 チュートリアル](https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/hello_world.html) TypeScript 版。

## 手順

```sh
bun i
bunx cdk list
bunx cdk bootstrap # 一度もCDKを実行したことのないリージョンではこれを実行。CloudFormationにスタックCDKToolkitができる
bunx cdk deploy
#
bunx cdk diff
bunx cdk destroy
```

`cdk build` 相当が不要。

## TODO

- ✅lambda を外出しにする
- ✅LogGroup をスタックに追加する
- いま mjs で書いてる lambda を ts にして、パッケージ依存もやる前処理を書く
- jest を vitest にする。
- Terraform の output サブコマンド相当のが欲しい。 [Command: output | Terraform | HashiCorp Developer](https://developer.hashicorp.com/terraform/cli/commands/output) → `bun run deploy` で ./outputs.json に出すようにした。run-scripts 参照。
