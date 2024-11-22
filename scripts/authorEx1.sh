#!/bin/bash
export ENDPOINT="$(jq .HelloCdkTs3.endpoint ./outputs.tmp.json -r)"

curl -X POST -H "Content-Type: application/json" -d '{"name":"Naoki", "age":35}' "${ENDPOINT}/author"
