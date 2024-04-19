// import the `Kafka` instance from the kafkajs library
const { Kafka } = require("kafkajs")

// the client ID lets kafka know who's producing the messages
const clientId = "lab4-producer"
// we can define the list of brokers in the cluster
const brokers = ["my-cluster-kafka-bootstrap.debezium-example.svc:9092"]
// this is the topic to which we want to write messages
const topicKafka = "msg-priority-1"

// initialize a new kafka client and initialize a producer from it
const kafka = new Kafka({ clientId, brokers })
const producer = kafka.producer()
console.log(`producer - producer created: ${kafka.producer.name}`)

// we define an async function that writes a new message each second
const produce = async () => {
	await producer.connect()
	console.log(`producer - producer connected`)
	let i = 0

	// Create a new topic if it doesn't exists
	const admin = kafka.admin();
    await admin.connect();
    const topics = await admin.listTopics();
	if (!(topics.includes(topicKafka))){
		console.log(`producer - create topic`)
		await admin.createTopics({
			topics: [{ topic: topicKafka, numPartitions: 3, replicationFactor: 2 }],
	  	});
	}
	console.log(`producer - topics: ${admin.listTopics()}`)

	// after the produce has connected, we start an interval timer
	setInterval(async () => {
		try {
			// send a message to the configured topic with
			// the key and value formed from the current value of `i`
			await producer.send({
				topic: topicKafka,
				messages: [
					{
						key: String(i),
						value: "this is message " + i,
					},
				],
			})

			// if the message is written successfully, log it and increment `i`
			console.log("producer - writes: ", i)
			i++
		} catch (err) {
			console.error("producer - could not write message " + err)
		}
	}, 1000)
}

module.exports = produce
