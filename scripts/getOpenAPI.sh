#!/bin/bash

export APIGWID="$(jq .HelloCdkTs3.apigwid ./outputs.tmp.json -r)"

aws apigateway get-export \
  --rest-api-id "$APIGWID" \
  --stage-name prod \
  --export-type oas30 \
  ./openapi.tmp.json
