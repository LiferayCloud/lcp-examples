# Configuring CCR (Cross Cluster Replication) on Elasticsearch

To make this configuration we must have 2 elasticsearchs clusters:</br>

 - **The Leader**
 - **The Follower**

An example of deployment is in the `./elasticsearch`, to deploy it just run the next command within your specific cluster and namespace:</br>

```bash
kubectl apply -f ./elasticsearch
```

Both the leader and the follower can share the same configuration, which is why there is only one elasticsearch cluster deployment configuration within `./elasticsearch`.</br>

After deploying the elasticsearch cluster in each environment and also the external IP from the ```elasticsearch-loadbalancer``` service get ready, we will use it to configure the CCR between them using the Elasticsearch API.</br>

### Loadbalancer services IPs
To check the external IPs created for the elasticsearch-loadbalancer service just run:</br>
```bash
 kubectl get services -n $namespace
 ```

Elasticsearch will be accessible through these IPs created by the elasticsearch-svc-loadbalancer.yml service.</br>

Now creating variables with the respective access ip of each service load balancer of the deployed elasticsearch clusters.</br>

```bash
export LEADER_ELASTICSEARCH_IP=11.22.333.444
export FOLLOWER_ELASTICSEARCH_IP=22.33.444.555
```

First, for CCR configuration, we need to configure the **Remote Cluster**, that should be done in Follower Cluster to Leader Cluster.</br>

Assuming my elasticsearch Leader Cluster is accessible by ```http://$LEADER_ELASTICSEARCH_IP:9200``` and the follower is accessible by ```http://$FOLLOWER_ELASTICSEARCH_IP:9200```</br>

### Configuring the Remote Cluster

```bash
curl -XPUT "http://$FOLLOWER_ELASTICSEARCH_IP:9200/_cluster/settings?pretty" \
--header "Content-Type: application/json" \
--data '{
  "persistent": {
    "cluster": {
      "remote": {
        "leader_cluster": {
          "mode": "proxy",
          "proxy_address": "$LEADER_ELASTICSEARCH_IP:9300"
        }
      }
    }
  }
}'
```

After configuring the remote cluster, you can obtain the **Remote Cluster** configuration information by running the following command:</br>

```bash
curl -XGET "http://$FOLLOWER_ELASTICSEARCH_IP:9200/_cluster/settings"
```

### Testing the Remote Cluster

```bash
curl -XGET "http://$FOLLOWER_ELASTICSEARCH_IP:9200/remote_cluster_name:index_from_remote_cluster/_search"
```

With this command, run on the Follower Elasticsearch Cluster, you should be able to get all the results from the Leader Elasticsearch Cluster index.</br>

### Configuring the CCR (Cross Cluster Replication) on Follower Elasticsearch Cluster

```bash
curl -XPUT "http://$FOLLOWER_ELASTICSEARCH_IP:9200/follower_index/_ccr/follow" \
--header "Content-Type: application/json" \
--data '{
  "remote_cluster" : "leader_cluster",
  "leader_index" : "index_from_leader"
}'
```

The CCR (Cross Cluster Replication) was applied to the Follower Elasticsearch Cluster following a specific index of the Remote Cluster (Leader Elasticsearch Cluster).</br>

Then, the entire Remote Cluster index was replicated in the Follower Elasticsearch Cluster and all new values ​​inserted in the official Leader Elasticsearch Cluster index </br>
they are also replicated in the Follower Elasticsearch Cluster due to the CCR configuration.</br>

### Querying the follower index on Follower Elasticsearch Cluster

You can validate the configuration of the CCR (Cross Cluster Replication) by consulting the follower_index in the Follower Elasticsearch Cluster after entering a new value in the index followed (leader_index) in the Leader Elasticsearch Cluster.</br>

```bash
curl -XGET "http://$FOLLOWER_ELASTICSEARCH_IP:9200/follower_index/_search/?pretty"
```

## Removing CCR configuration
Removing the CCR configuration and stopping the follower index this enables the index to treated as a regular index.</br>

### Pause Follow Index
First of all you need to pause the follower index.</br>
```bash
curl -XPOST "http://$FOLLOWER_ELASTICSEARCH_IP:9200/follower_index/_ccr/pause_follow"
```

### Close the Follow Index
After pause your follower index you need to close it.</br>

```bash
curl -XPOST "http://$FOLLOWER_ELASTICSEARCH_IP:9200/follower_index/_close"
```

### Unfollow Index
Once the follower index is paused and closed, you can stop following it, the unfollow API Converts a follower index to a regular index.</br>

```bash
curl -XPOST "http://$FOLLOWER_ELASTICSEARCH_IP:9200/follower_index/_ccr/unfollow"
```

### Reopen Index
If you want to continue using the index after removing CCR (Cross Cluster Replication), you will need to reopen the index</br>

```bash
curl -XPOST "http://$FOLLOWER_ELASTICSEARCH_IP:9200/follower_index/_open"
```
