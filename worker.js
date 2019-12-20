'use strict';

const utils = require('./helpers/db.js');
const db = utils.db;

const subscriptionName = 'your-subscription-name';



listenForMessages(subscriptionName, 0);

function listenForMessages(subscriptionName, timeout) {
    // [START pubsub_subscriber_async_pull]
    // [START pubsub_quickstart_subscriber]
    // Imports the Google Cloud client library
    const { PubSub } = require('@google-cloud/pubsub');

    // Creates a client
    const pubsub = new PubSub();
    console.log(`Connected to PubSub.`);
    /**
     * TODO(developer): Uncomment the following lines to run the sample.
     */
    //subscriptionName = 'my-sub';
    //timeout = 60;

    // References an existing subscription
    const subscription = pubsub.subscription(subscriptionName);

    console.log(`Listening to incoming messages...`);
    // Create an event handler to handle messages
    let messageCount = 0;
    const messageHandler = message => {
        console.log(`Received message ${message.id}:`);
        console.log(`\tData: ${message.data}`);
        //console.log(JSON.parse(message.data));
        
        console.log(`\tAttributes: ${message.attributes}`);
        console.log(message.attributes);
        messageCount += 1;

        insertCard(JSON.parse(message.data));

        // "Ack" (acknowledge receipt of) the message
        message.ack();
    };

    // Listen for new messages until timeout is hit
    subscription.on(`message`, messageHandler);

    if (timeout !== 0) {
        setTimeout(() => {
            subscription.removeListener('message', messageHandler);
            console.log(`${messageCount} message(s) received.`);
        }, timeout * 1000);
    }
    // [END pubsub_subscriber_async_pull]
    // [END pubsub_quickstart_subscriber]
}

function insertCard(body) {
    return new Promise(function (resolve, reject) {

        db.collection("cards").add(body)
            .then(function (docRef) {
                console.log("Document written with ID: ", docRef.id);
                resolve(docRef.id);
            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
                resolve('Nothing')
            });
    });
}