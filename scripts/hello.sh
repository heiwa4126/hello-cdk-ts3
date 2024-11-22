#!/bin/bash
export ENDPOINT="$(jq .HelloCdkTs3.endpoint ./outputs.tmp.json -r)"

curl "${ENDPOINT}/hello" -v
