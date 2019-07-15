# Introduction
This example shows how to deploy a robust, scalable Elasticsearch 6.8.x cluster, containing 3 master instances, for high availability, and 5 data instances, for scalability, performance and high availability.

# Configuration

## Master
This code will deploy 3 masters in parallel, each with its own persistent volume, 4 cores and 12 GB of RAM, with those, 8GB allocated to Elasticsearch heap (the remaining memory are used by other elasticsearch processes outside the heap), called `esmaster`
These nodes communicate with each other and with the Data nodes (named `esdata`) via their headless services, with the `--cluster` suffix

## Data
We are deploying 5 data nodes, that will be spin up sequentially, to ease Elasticsearch's auto balancing load. Each instance have 4 cores and 12GB of RAM available, with 8GB being used by elasticsearch heap, and are called `esdata`
These nodes also use headless services to communicate with each other and with master nodes

# Customization
## Scaling
To scale `master` nodes, besides changing the `scale` attribute in its `LCP.json` file, it's also needed to change the `discovery.zen.minimum_master_nodes` to have a value equal to half the number of master nodes (for example: with 3 master nodes, 2 minimum. With 5 nodes, 3 minimum, and so forth). Also, to avoid data loss on a "split brain" (when there's a communication problem between the masters), it's highly recommended to always use a odd number of master nodes
To scale `data` nodes, it's only needed to change the `scale` attribute on its `LCP.json` file, and since every instance is restarted during a scaling change, specially when scaling **down**, the changes should be done one by one, since elasticsearch will rebalance its shards to reflect the new number
**IMPORTANT**: In both cases, when one of the node types is scaled, all of its nodes will be restarted to reflect this change, so it causes a performance hit

## Renaming services
to rename the services, besides changing the `id` on their `LCP.json` files, it's also needed to change **both** `elasticsearch.yml` files, in `discovery.zen.ping.unicast.hosts` to reflect the new name, always keeping the `--cluster` suffix
