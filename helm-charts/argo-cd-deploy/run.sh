#!/usr/bin/env bash

# This script is temporary. It will be redone using a GitOps tool later.

set -euo pipefail

DEBUG=${DEBUG:-"n"}
if [[ "$DEBUG" =~ ^([yY])+$ ]]; then
  set -x
fi

DRY_RUN=${DRY_RUN:-"y"}
if [[ "$DRY_RUN" =~ ^([yY])+$ ]]; then
  DRY_RUN="--dry-run"
  KUBE_DRY_RUN="--dry-run=client"
else
  DRY_RUN=""
  KUBE_DRY_RUN=""
fi

DIRNAME="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

pushd $DIRNAME > /dev/null

CMD=${1:?"Command is required [install or uninstall]. Usage: ${0} 'cmd' 'context'"}
KUBE_CONTEXT=${2:-$(kubectl config current-context)}

helmNamespace="argocd-system"
helmChartName="argo-cd"
helmChartVersion="5.4.1"
helmChartRepo="https://argoproj.github.io/argo-helm/"
helmReleaseName=${helmChartName}

function install() {
  command="install"

  declare -a args=(
    $helmReleaseName
    $helmChartName
    '--create-namespace'
    '--debug'
    '--repo='$helmChartRepo''
    '--kube-context='$KUBE_CONTEXT''
    '--version '$helmChartVersion''
    '--wait'
    '-f ./values.yaml'
    '-n='$helmNamespace''
    $DRY_RUN
  )

  if [[ $(helm list -n $helmNamespace -o json | \
      jq -r '.[] | select(.name=="'$helmReleaseName'") | true') == true ]];then
    command="upgrade"
    args+=('--install' '--reset-values')
  else
    args+=('--replace')
  fi

  echo "Installing/Upgrading Helm Chart ${helmReleaseName} in ${KUBE_CONTEXT} Context Kubernetes"
  helm $command ${args[*]}

  kubectl delete appproject $KUBE_DRY_RUN --ignore-not-found=true --context ${KUBE_CONTEXT} -n $helmNamespace default
}

function uninstall() {
  echo "Uninstalling Helm Chart ${helmReleaseName} in ${KUBE_CONTEXT} Context Kubernetes"
  cmdDelNS="kubectl delete ns $helmNamespace $KUBE_DRY_RUN --context=$KUBE_CONTEXT"
  (helm uninstall $helmReleaseName \
    --keep-history \
    --kube-context=$KUBE_CONTEXT \
    $DRY_RUN \
    -n=$helmNamespace && \
  $cmdDelNS) || $cmdDelNS
}

case $CMD in
  install)
    install
    ;;
  uninstall)
    uninstall
    ;;
esac

popd > /dev/null
