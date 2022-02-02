const mqtt = require('mqtt')

require('dotenv').config()

const clientId = 'mqttjs_' + Math.random().toString(8).substr(2, 4)

const client = mqtt.connect(process.env.BROKER_URL, {
  clientId: clientId,
  clean: false,
})

console.log(process.env.BROKER_URL, 'client', clientId)

const topicName = process.env.TOPIC_NAME
console.log('topicName', topicName)

client.on('connect', function (connack) {
  console.log('client connected', connack)

  // on client conection publish messages to the topic on the server/broker
  const payload = ['Hello world', 'Welcome to the test connection']

  // assumming messages comes in every 3 seconds to our server and we need to publish or proecess these messages
  setInterval(() => {
    const rancomkeyId = 'key_' + Math.random().toString(8).substr(2, 8)
    console.log('Message published with key:', rancomkeyId)

    const payloadSend = [...payload, [rancomkeyId]]
    client.publish(
      process.env.TOPIC_NAME,
      JSON.stringify(payloadSend),
      { qos: 1, retain: true },
      (PacketCallback, err) => {
        if (err && err.cmd !== 'publish') {
          console.log('MQTT publish packet', err)
        }
      }
    )
  }, 3000)
})

client.on('error', function (err) {
  console.log('Error: ' + err)
  if (err.code == 'ENOTFOUND') {
    console.log(
      'Network error, make sure you have an active internet connection'
    )
  }
})

client.on('close', function () {
  console.log('Connection closed by client')
})

client.on('reconnect', function () {
  console.log('Client trying a reconnection')
})

client.on('offline', function () {
  console.log('Client is currently offline')
})
