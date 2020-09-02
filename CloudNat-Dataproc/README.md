#### Configuring Cloud Nat for Dataproc

---

**1. First of all, get sure to be on correct project.**

```bash
gcloud config set project $PROJECT_ID
```

**PROJECT_ID** is the project name.

**2. Creating a VPC in which the Dataproc will be involved.**

Read and manipulate VPC networks and the create command will create a Compute Engine network.

```bash
gcloud compute networks create $VPC_NAME \
    --subnet-mode=auto \
    --bgp-routing-mode=$DYNAMIC_ROUTING_MODE
```

**VPC_NAME** is a name for the VPC network.<br/>
**DYNAMIC_ROUTING_MODE** can be either **global** or **regional** to control the behavior of Cloud Routers in the network. If not specified, defaults to regional.<br/>

- **global**

```
Cloud Routers in this network advertise subnetworks from all regions to their BGP (Border Gateway Protocol) peers, and program instances in all regions with the router's best learned BGP routes.
```

- **regional**

```
Cloud Routers in this network advertise subnetworks from their local region only to their BGP peers, and program instances in their local region only with the router's best learned BGP routes.

```

For more documentation about VPC<br/>
https://cloud.google.com/vpc/docs/using-vpc#gcloud<br/>
https://cloud.google.com/sdk/gcloud/reference/compute/networks/create<br/>

**3. Create a GCP Router.**

Create a Google Compute Engine router.

```bash
gcloud compute routers create $ROUTER_NAME \
    --network $VPC_NAME \
    --region $REGION

```

**ROUTER_NAME** is a name for the cloud router.<br/>
**VPC_NAME** The network for this router.<br/>
**REGION** Region of the router to create. If not specified, you may be prompted to select a region.<br/>

For more documentation about Cloud Router<br/>
https://cloud.google.com/network-connectivity/docs/router/how-to/creating-routers<br/>
https://cloud.google.com/sdk/gcloud/reference/compute/routers/create<br/>

**4. Create a GCP External IP addresses.**

Read and manipulate Compute Engine addresses and the create command will reserve IP addresses.

```bash
gcloud compute addresses create $IP_ADDRESS_NAME
```

**IP_ADDRESS_NAME** is a name for the external ip address.<br/>

For more documentation about External Ip Addresses<br/>
https://cloud.google.com/sdk/gcloud/reference/compute/addresses/create<br/>
https://cloud.google.com/compute/docs/ip-addresses/reserve-static-external-ip-address<br/>

**5. Create a Cloud Nat Config.**

Add a NAT to a Google Compute Engine router.

```bash
gcloud compute routers nats create $NAT_NAME \
    --router=$ROUTER_NAME \
    --nat-all-subnet-ip-ranges \
    --nat-external-ip-pool=$IP_ADDRESS_NAME
```

**NAT_NAME** is a name for the external ip address.<br/>
**ROUTER_NAME** is a name of the cloud router that will be used.<br/>
**IP_ADDRESS_NAME** is a name of the external ip address that will be used.<br/>

For more documentation about Cloud Nat<br/>
https://cloud.google.com/nat/docs/using-nat#gcloud<br/>
https://cloud.google.com/sdk/gcloud/reference/compute/routers/nats<br/>

**6. Create a Dataproc cluster with private ips only.**

Google Cloud Dataproc clusters and jobs. The create command creates a Dataproc cluster.

```bash
gcloud dataproc clusters create $DATAPROC_NAME \
    --region=$REGION \
    --no-address \
    --subnet=projects/PROJECT_ID/regions/REGION/subnetworks/SUBNET_NAME
```

**DATAPROC_NAME** is a name for the dataproc cluster.<br/>
**REGION** Dataproc region for the cluster. Each Dataproc region constitutes an independent resource namespace constrained to deploying instances into Compute Engine zones inside the region.<br/>
**--subnet** needs to be filled with the path to the subnets created by the VPC.<br/>
**--no-address** If provided, the instances in the cluster will not be assigned external IP addresses.<br/>

For more documentation about Dataproc<br/>
https://cloud.google.com/sdk/gcloud/reference/dataproc/clusters/create<br/>
https://cloud.google.com/dataproc/docs/concepts/configuring-clusters/network?hl=pt-br#overview<br/>

---

#### How to connect to the Dataproc VMs using IAP (Identity Aware Proxy)

Using SSH with IAP's TCP forwarding feature wraps an SSH connection inside HTTPS. IAP's TCP forwarding feature then sends it to the remote instance.

1. **Grant the roles/iap.tunnelResourceAccessor role to the user that wants to connect to the VM.**

2. **To allow IAP to connect to your VM instances, create a firewall rule that:**

- applies to all VM instances that you want to be accessible by using IAP.
- allows ingress traffic from the IP range 35.235.240.0/20. This range contains all IP addresses that IAP uses for TCP forwarding.
- allows connections to all ports that you want to be accessible by using IAP TCP forwarding, for example, port 22 for SSH and port 3389 for RDP.

3. **Access using IAP**

```bash
gcloud beta compute ssh --zone zone instance-name --tunnel-through-iap --project project-id
```

**instance-name** name of the VM instance.<br/>
**zone** instance’s zone.<br/>
**project-id** project identification.<br/>

Some documentation about connecting to instances using advanced methods<br/>
https://cloud.google.com/compute/docs/instances/connecting-advanced#cloud_iap<br/>
https://cloud.google.com/iap/docs/using-tcp-forwarding<br/>
https://cloud.google.com/iap/docs/managing-access#overview<br/>
