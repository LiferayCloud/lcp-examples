const axios = require('axios');
const chalk = require('chalk');
const sleep = require('sleep');

const log = console.log;

// Cluster IPs taken by exported environments
const leader_elasticsearch_cluster = process.env.LEADER_CLUSTER_IP;
const follower_elasticsearch_cluster = process.env.FOLLOWER_CLUSTER_IP;

// Index names created during testing
const leader_index_name = 'leader_index';
const follower_index_name = 'follower_index';

// This function inserts values ​​for the Leader custer in the index passed by parameter
const insertIndex = async (indexName) => {
  // create a random name to be used as ID
  let name = Math.random().toString(36).substring(7);
  // create a date for the insertion date
  let date = new Date();
  // used to get the start time of the operation
  let start = new Date();
  // Creates the URL for elasticsearch API
	let url = `${leader_elasticsearch_cluster}:9200/${indexName}/_doc`;

  // Create de Data for insertion
	let data = {
		userId: `${name}`,
		insert_date: `${date}`,
		message: `User inserted in the Leader Cluster index: ${name} at ${date}`,
		operation_took:
			'Operation took ' + (new Date().getTime() - start.getTime()) + ' msec',
	};

	try {
    // Perform the request to Elasticsearch API
		const response = await axios.default.post(`${url}`, data);
		log(
			chalk.blueBright(
				`Inserting a value to the existing Index '${indexName}' in the Cluster Elasticsearch Leader.`
			)
    );
    // return the inserted Data
		return data;
	} catch (error) {
		throw new Error(`Error when inserting value to ${indexName} on Leader Cluster \n`, error.response.data.error.reason);
	}
};

// This function remove the CCR configuration and enable the follower index to treated as a regular index
const CCRPauseFollow = async (start) => {
  // create a random name to be used as ID
  let name = Math.random().toString(36).substring(7);
  // create a date for the insertion date
  let date = new Date();
  // Create de Data for insertion
	let data = {
		userId: `${name}`,
		insert_date: `${date}`,
		message: `NEW USER INSERTED ON SAME INDEX '${follower_index_name}' AFTER STOP THE CCR CONFIG ON CLUSTER`,
		operation_took:
			'Operation took ' + (new Date().getTime() - start.getTime()) + ' msec',
	};

	try {
    // Perform the _ccr/pause_follow request to Elasticsearch API
		let response = await axios.default.post(
			`${follower_elasticsearch_cluster}:9200/${follower_index_name}/_ccr/pause_follow`
    );
    // Perform the _close request to Elasticsearch API
		response = await axios.default.post(
			`${follower_elasticsearch_cluster}:9200/${follower_index_name}/_close`
    );
    // Perform the _ccr/unfollow request to Elasticsearch API
		response = await axios.default.post(
			`${follower_elasticsearch_cluster}:9200/${follower_index_name}/_ccr/unfollow`
    );
    // Perform the _open request to Elasticsearch API
		response = await axios.default.post(
			`${follower_elasticsearch_cluster}:9200/${follower_index_name}/_open`
		);
	} catch (error) {
		throw new Error(`Error to remove the CCR configuration on Follower Cluster.\n`,error.response.data.error.reason);
	}

	try {
		log(
			chalk.blueBright(
				`Inserting new value directly to the index '${follower_index_name}' after removing the CCR configuration making it a primary index in the Follower Elasticsearch Cluster`
			)
    );
    // Perform an insert request to Elasticsearch API
		response = await axios.default.post(
			`${follower_elasticsearch_cluster}:9200/${follower_index_name}/_doc/?pretty`,
			data
		);
		return data;
	} catch (error) {
		throw new Error(`Error after remove the CCR configuration on Follower Cluster and trying to enable the ${follower_index_name} index to treated as a regular index.\n`,error.response.data.error.reason);
	}
};

// This function applys the Remote Cluster configuration to Follower Elasticsearch Cluster
const applyingRemoteClusterConfig = async () => {
  // Formatting the leader cluster url
	const leader_cluster = leader_elasticsearch_cluster
		.replace('http://', '')
    .replace('https://', '');
  // Formatting the request url
  let url = `${follower_elasticsearch_cluster}:9200/_cluster/settings?pretty`;
  // Create Data for Remote Cluster config 
	const data = {
		persistent: {
			cluster: {
				remote: {
					leader_cluster: {
						mode: 'proxy',
						proxy_address: `${leader_cluster}:9300`,
					},
				},
			},
		},
	};

	try {
		log(
			chalk.blueBright(
				'Applying the Remote Cluster configuration to Follower Elasticsearch Cluster'
			)
    );
    // Perform the request to Elasticsearch API
		const response = await axios.default.put(`${url}`, data);
	} catch (error) {
		throw new Error(`Error when applying Remote CLuster configuration to Follower Elasticsearch Cluster.\n`,error.response.data.error.reason);
	}
};

// This function applys the CCR (Cross Cluster Replication) configuration to Follower Elasticsearch Cluster
const applyingCrossClusterReplicationConfig = async () => {
  // Formatting the request url
  let url = `${follower_elasticsearch_cluster}:9200/${follower_index_name}/_ccr/follow`;
  // Create Data for CCR config
	const data = {
		remote_cluster: 'leader_cluster',
		leader_index: `${leader_index_name}`,
	};

	try {
    // Perform the request to Elasticsearch API
		const response = await axios.default.put(`${url}`, data);
		log(
			chalk.blueBright(
				'Applying the CCR (Cross Cluster Replication) configuration on Follower Elasticsearch Cluster'
			)
		);
	} catch (error) {
		throw new Error(`Error when applying the CCR (Cross Cluster Replication) configuration on Follower Elasticsearch Cluster.\n`,error.response.data.error.reason);
	}
};

// This function queries a value using the remote cluster configuration applied to the Cluster Follower
const checkRemoteClusterCofiguration = async (insertData) => {
	try {
    // Perform the search request to Elasticsearch API
		const { data: response } = await axios.default.get(
			`${follower_elasticsearch_cluster}:9200/leader_cluster:${leader_index_name}/_search?q=userId:${insertData.userId}`
		);

		if (response.hits.total.value === 1)
			log(
				chalk.green('\nPass! Remote Cluster configuration was successful ! \n')
			);
	} catch (error) {
		throw new Error(`Error when trying to query an index through the Remote Cluster configuration.\n`,error.response.data.error.reason);
	}
};

// This function queries a value in an index using the information passed by parameter
const checkMatchingIndexes = async (
	cluster,
	insertData,
	appliedIndex,
	consultedIndex
) => {
	try {
    // Perform the search request to Elasticsearch API
		const { data: response } = await axios.default.get(
			`${cluster}:9200/${consultedIndex}/_search?q=userId:${insertData.userId}`
		);

		if (response.hits.total.value === 1)
			log(
				chalk.green(
					`\nPass! The values ​​applied in index '${appliedIndex}' were consulted and exist in index '${consultedIndex}' ! \n`
				)
			);
	} catch (error) {
		throw new Error(`Error querying index ${consultedIndex} on cluster ${cluster}.\n`,error.response.data.error.reason);
	}
};

//This function is performed after all checks and it deletes all created indexes and consequently their values
const deleteTestingIndexes = async () => {
  // Create url for Leader cluster request
  let urlLeader = `${leader_elasticsearch_cluster}:9200/${leader_index_name}`;
  // Create url for Follower cluster request
	let urlFollower = `${follower_elasticsearch_cluster}:9200/${follower_index_name}`;

	try {
		log(
			chalk.green(
				'The CCR test is done, Excluding created indexes used for testing !'
			)
    );
    // Perform the delete request for Leader to Elasticsearch API
		await axios.default.delete(`${urlLeader}`);
    log(chalk.green("\nExcluding the test index 'leader_index'"));
    // Perform the delete request for Follower to Elasticsearch API
		await axios.default.delete(`${urlFollower}`);
		log(chalk.green("\nExcluding the test index 'follower_index'"));
	} catch (error) {
		throw new Error(`Error deleting indexes.\n`,error.response.data.error.reason);
	}
};

const main = async () => {
	let insertData;
	try {
		insertData = await insertIndex(leader_index_name);

		sleep.sleep(10);

		await checkMatchingIndexes(
			leader_elasticsearch_cluster,
			insertData,
			leader_index_name,
			leader_index_name
		);

		await applyingRemoteClusterConfig();

		sleep.sleep(10);

		await checkRemoteClusterCofiguration(insertData);

		await applyingCrossClusterReplicationConfig();

		insertData = await insertIndex(leader_index_name);

		sleep.sleep(10);

		await checkMatchingIndexes(
			follower_elasticsearch_cluster,
			insertData,
			leader_index_name,
			follower_index_name
		);

		sleep.sleep(10);

		let start = new Date();
		insertData = await CCRPauseFollow(start);

		sleep.sleep(10);

		await checkMatchingIndexes(
			follower_elasticsearch_cluster,
			insertData,
			follower_index_name,
			follower_index_name
		);

		await deleteTestingIndexes();

		log(chalk.green('\nThe test ended successfully.'));
	} catch (error) {
		console.log(error);
	}
};

main();
