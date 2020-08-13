#### Service Webserver for Elasticsearch
---
For this service we are using the latest version of Nginx

```Dockerfile
FROM nginx:latest
```

The **nginx.conf** is being filled with a basic configuration where the proxy_pass of the web server root path `/` is serving the Elasticsearch service deployed in the same stack.
For this purpose, two new ENV vars were used in **nginx.conf** used to whitelist an IP and to specify the name of the elasticsearch service.


Environment Variable     |  Default    |
-------------------------|-------------|
WHITELISTED_IP           |  0.0.0.0    |
SERVICE_ELASTICSEARCH_ID |  search     |
LCP_CPU                  |  2          |
WORKER_CONNECTIONS       |  10000      |
KEEP_ALIVE_TIMEOUT       |  65         |
HEALTH_CHECK_CIDR_IP     |  10.0.0.0/8 |

To add these env when deploying just add this block of properties to your webserver's `LCP.json`

```json
"env": {
    "WHITELISTED_IP": "11.22.333.444",
    "SERVICE_ELASTICSEARCH_ID": "newsearch"
  },
```

It can be changed directly on the console also on the service environments page.

---
## CIDR

#### More about filling in variable HEALTH_CHECK_CIDR_IP

**When an auto mode VPC network is created**, one subnet from each region is automatically created within it.
These automatically created subnets use a set of [predefined IP ranges](https://cloud.google.com/vpc/docs/vpc#ip-ranges) that fit within the 10.128.0.0/9 CIDR block.

**When a custom mode VPC network is created**, no subnets are automatically created.
This type of network provides you with complete control over its subnets and IP ranges.
You decide which subnets to create in regions that you choose by using IP ranges that you specify.