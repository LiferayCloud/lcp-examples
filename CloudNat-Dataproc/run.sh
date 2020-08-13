#!/bin/bash

set -eo errexit

# Validating EnvVars
check_envVars() {
  if [[ -z "${PROJECT_ID}" ]]; then
    echo "The PROJECT_ID is empty"
    exit 1
  fi
  if [[ -z "${VPC_NAME}" ]]; then
    echo "The VPC_NAME is empty"
    exit 1
  fi
  if [[ -z "${DYNAMIC_ROUTING_MODE}" ]]; then
    echo "The DYNAMIC_ROUTING_MODE is empty"
    exit 1
  fi
  if [[ -z "${ROUTER_NAME}" ]]; then
    echo "The ROUTER_NAME is empty"
    exit 1
  fi
  if [[ -z "${IP_ADDRESS_NAME}" ]]; then
    echo "The IP_ADDRESS_NAME is empty"
    exit 1
  fi
  if [[ -z "${NAT_NAME}" ]]; then
    echo "The NAT_NAME is empty"
    exit 1
  fi
  if [[ -z "${DATAPROC_NAME}" ]]; then
    echo "The DATAPROC_NAME is empty"
    exit 1
  fi
  if [[ -z "${REGION}" ]]; then
    echo "The REGION is empty"
    exit 1
  fi
  if [[ -z "${SUBNET_NAME}" ]]; then
    echo "The SUBNET_NAME is empty"
    exit 1
  fi
}

setup_project() {
  echo "Setting up project $PROJECT_ID."
  gcloud config set project $PROJECT_ID
}

create_vpc() {
  echo "Creating VPC $VPC_NAME with $DYNAMIC_ROUTING_MODE BGP routing mode."
  gcloud compute networks create $VPC_NAME \
    --subnet-mode=auto \
    --bgp-routing-mode=$DYNAMIC_ROUTING_MODE
}

create_gcp_router() {
  echo "Creating GCP Router $ROUTER_NAME on $VPC_NAME network in the $REGION region."
  gcloud compute routers create $ROUTER_NAME \
    --network $VPC_NAME \
    --region $REGION
}

create_externalIp() {
  echo "Creating External Ip Addresses $IP_ADDRESS_NAME."
  gcloud compute addresses create $IP_ADDRESS_NAME
}

create_cloudNat() {
  echo "Creating $NAT_NAME Cloud Nat with $ROUTER_NAME GCP Router and $IP_ADDRESS_NAME nat external ip pool"
  gcloud compute routers nats create $NAT_NAME \
    --router=$ROUTER_NAME \
    --nat-all-subnet-ip-ranges \
    --nat-external-ip-pool=$IP_ADDRESS_NAME
}

create_dataproc_cluster() {
  echo "Creating $DATAPROC_NAME Dataproc Cluster in the $REGION region, with the projects/$PROJECT_ID/regions/$REGION/subnetworks/$SUBNET_NAME subnet path." 
  gcloud dataproc clusters create $DATAPROC_NAME \
    --region=$REGION \
    --no-address \
    --subnet=projects/$PROJECT_ID/regions/$REGION/subnetworks/$SUBNET_NAME
}

main() {
  echo "Validating environment variables."
  check_envVars

  echo "Starting Configuration..."
  setup_project
  create_vpc
  create_gcp_router
  create_externalIp
  create_cloudNat
  create_dataproc_cluster
}

main