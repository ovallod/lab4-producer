// Assisted by WCA@IBM
// Latest GenAI contribution: ibm/granite-20b-code-instruct-v2
const { Kafka } = require('kafka-node');

// Create a new Kafka client instance
const kafkaClient = new Kafka({
  kafkaHost: 'localhost:9092', // Replace with your Kafka broker address
  clientId: 'my-consumer-group',
  requestTimeout: 4000,
  connectTimeout: 4000,
  reconnectThreshold: 10,
  autoConnect: true,
  connectRetryOptions: {
    retries: 5,
    delay: 1000,
    maxTimeout: 60 * 1000,
    initialDelay: 1000,
  },
});

// Connect to the Kafka cluster
kafkaClient.connect();

// Create a new Kafka producer instance
const producer = new kafkaClient.Producer();

// Connect to the Kafka producer
producer.on('ready', () => {
  console.log('Kafka producer connected.');

  // Define the topic to create
  const topicName = 'test-topic';

  // Define the number of partitions for the topic
  const numPartitions = 1;

  // Define the replication factor for the topic
  const replicationFactor = 1;

  // Create the topic
  producer.createTopics(
    [
      {
        topic: topicName,
        partitions: numPartitions,
        replicationFactor: replicationFactor,
      },
    ],
    (err, data) => {
      if (err) {
        console.error('Error creating topic:', err);
      } else {
        console.log('Topic created:', data);
      }

      // Disconnect from the Kafka cluster
      kafkaClient.close();
    }
  );
});
