#!/bin/bash
export ENDPOINT="$(jq .HelloCdkTs3.endpoint ./outputs.tmp.json -r)"

# 全部{"message": "Invalid request body"}になるはず
curl -X POST -H "Content-Type: application/json" -d '{"name":"Naoki","age":"35"}' "${ENDPOINT}/author"
curl -X POST -H "Content-Type: application/json" -d '{"name":"Naoki","age":135"}' "${ENDPOINT}/author"
curl -X POST -H "Content-Type: application/json" -d '{"name":"Naoki"}' "${ENDPOINT}/author"
curl -X POST -H "Content-Type: application/json" -d '{"age":35}' "${ENDPOINT}/author"
