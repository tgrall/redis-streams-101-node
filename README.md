# Getting Started with Redis Streams & Node.js

This project shows how to use [Redis Node client](http://redis.js.org/) to publish and consume messages using consumer groups.

This is a first basic example that use a single consumer.

## Build

```
> cd redis-streams-101-node

> npm install


```

## Run

You have access to a Redis instance/cluster.

Open 2 terminal windows 

### Run the Producer

```redis-streams-101-node
> cd redis-streams-101-node

> node producer.js loop=1000 sleep=500
```

Where:

* `loop` is the number of messages sent by the program (in a lopp)
* `sleep` the time in milliseconds between each message post


### Run the Consumer

```bash
> cd redis-streams-101-node

> node consumer.js 

```

This will print all the messages that have not yet been consumed by the group.