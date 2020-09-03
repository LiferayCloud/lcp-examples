# Run CCR (Cross Cluster Replication) test on Elasticsearch
---
To perform the tests, two variables are necessary in the execution of the docker image, they are:</br>

 - **LEADER_CLUSTER_IP**
 - **FOLLOWER_CLUSTER_IP**

 The variable **LEADER_CLUSTER_IP** must be filled in with Leader Elasticsearch Cluster access without port 9200, for example:</br>

- If my Leader Elasticsearch cluster is acessible by `http://11.222.333.444:9200`, the environment variable must be filled with `http://11.222.333.444`</br>

```bash
LEADER_CLUSTER_IP=http://11.222.333.444
```

The variable **FOLLOWER_CLUSTER_IP** must be filled in with Follower Elasticsearch Cluster access without port 9200, for example:</br>

- If my Follower Elasticsearch cluster is acessible by `http://22.333.444.555:9200`, the environment variable must be filled with `http://22.333.444.555`</br>

```bash
FOLLOWER_CLUSTER_IP=http://22.333.444.555
```

## Run tests through the docker image

---
### Build docker image
Run docker build to build the test image.</br>

```bash
docker build . -t elasticsearch_test:1.0 
```

### Run docker image
Run elasticsearch test image.</br>

```bash
docker run -e LEADER_CLUSTER_IP=http://11.222.333.444 -e FOLLOWER_CLUSTER_IP=http://22.333.444.555 elasticsearch_test:1.0 
```

## Run JS file directly
---
### npm instal
Run npm instal at same folder where the `package.json` is.</br>
```bash
npm install
```

### export envs
The JS script expects two envs to be exported to work correctly **LEADER_CLUSTER_IP** and **FOLLOWER_CLUSTER_IP**</br>
```bash
export LEADER_CLUSTER_IP=http://11.222.333.444
export FOLLOWER_CLUSTER_IP=http://22.333.444.555
```

### Run index.js
To run Elasticsearch tests after the above steps, just run npm start script.</br>

```bash
npm run start
```


## Test steps
---
When the test is running, first 2 indexes will be created (`leader_index` and `follower_index`), the first in the `Leader Elasticsearch cluster` and the second in the `Follower Elasticsearch cluster`.</br>

After that, the `Remote Cluster` configuration is applied to the Follower cluster and is tested by consulting the `leader_index` through that configuration applied to it.</br>

The next step in the test is to apply the `CCR (Cross Cluster Replication)` setting in `Follower Cluster` and insert a new value into `leader_index` in `Leader Cluster` and query it through the CCR config in `follower_index` in `Follower Cluster `. </br>

Basically the index applied to the `leader_index` must be replicated in the `follower_index` due to the CCR.</br>

The last step is to remove the `CCR (Cross Cluster Replication)` configuration and make `follower_index` a primary index for the `Follower Cluster` and perform an insertion directly into it.</br>

After all steps are successfully completed, the test indexes will be deleted:</br>

- **leader_index**
- **follower_index**
</br>

#### Test logs
![image](/elasticsearch-cluster-CCR/test/docker.png)