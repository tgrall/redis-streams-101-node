'use strict';

var redis = require('redis');
var redisClient = redis.createClient();

const STREAMS_KEY = "weather_sensor:wind";


function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

async function main() {
    
    // capture the paramter
    const args = process.argv
    .slice(2)
    .map(arg => arg.split('='))
    .reduce((args, [value, key]) => {
        args[value] = key;
        return args;
    }, {});

    var sleep_time = 200;
    var loop_nb = 20;
    if (args && args.loop && !isNaN(args.loop)) {
        loop_nb = args.loop;
    }

    if (args && args.sleep && !isNaN(args.sleep)) {
        sleep_time = args.sleep;
    }

    console.log(`\nThis program will send ${loop_nb} messages, every ${sleep_time}ms`);

    for (var i = 0 ; i <= loop_nb ; i++) {
        console.log(`\tSending message ${i}`);

        // create the message values:
        var speed = Math.round(Math.random() * 45);
        var direction = Math.round(Math.random() * 359);
        var ts = (new Date()).getTime();

        // produce the message
        redisClient.xadd(STREAMS_KEY, '*', 
        'speed', speed,  
        'direction', direction,  
        'sensor_ts', ts, 
        'loop_info', i,  
        function (err) { 
                if (err) { console.log(err) };
            });

        await sleep(sleep_time);

        if (i == loop_nb) {
            process.exit()
        }
    
    }
}

main();