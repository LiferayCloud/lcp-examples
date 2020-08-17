#!/bin/bash

set -e

# Validating EnvVars
check_envVars() {
  if [[ -z "${LEADER_CLUSTER_IP}" ]]; then
    echo "The LEADER_CLUSTER_IP is empty"
    exit 1
  fi

  if [[ -z "${FOLLOWER_CLUSTER_IP}" ]]; then
    echo "The FOLLOWER_CLUSTER_IP is empty"
    exit 1
  fi
}

# Perform elasticsearch tests on the docker container
run_elasticsearch_test() {
  cd /elasticsearch_test
  node index.js
}

main() {
  check_envVars
  run_elasticsearch_test
}

main