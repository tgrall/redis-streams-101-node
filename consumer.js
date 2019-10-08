'use strict';

var async = require('async');

var redis = require('redis');
var redisClient = redis.createClient();

const STREAMS_KEY = "weather_sensor:wind";
const APPLICATION_ID = "iot_application:node_1";
var CONSUMER_ID = "consumer:1"


// create the group
redisClient.xgroup("CREATE", STREAMS_KEY, APPLICATION_ID, '$', function(err) {
    if (err) {
        if (err.code == 'BUSYGROUP' ) {
            console.log(`Group ${APPLICATION_ID} already exists`);
        } else {
            console.log(err);
            process.exit();    
        }
    }
});

async.forever(
    function(next) {
        redisClient.xreadgroup('GROUP', APPLICATION_ID, CONSUMER_ID, 'BLOCK', 500, 'STREAMS',  STREAMS_KEY , '>', function (err, stream) {
            if (err) {
                console.error(err);
                next(err);
            }

            if (stream) {
                var messages = stream[0][1]; 
                // print all messages
                messages.forEach(function(message){
                    // convert the message into a JSON Object
                    var id = message[0];
                    var values = message[1];
                    var msgObject = { id : id};
                    for (var i = 0 ; i < values.length ; i=i+2) {
                        msgObject[values[i]] = values[i+1];
                    }                    
                    console.log( "Message: "+ JSON.stringify(msgObject));
                });
                
            } else {
                // No message in the consumer buffer
                console.log("No new message...");
            }

            next();
        });
    },
    function(err) {
        console.log(" ERROR " + err);
        process.exit()
    }
);

