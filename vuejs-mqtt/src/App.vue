<!--https://www.emqx.com/en/blog/mqtt-js-tutorial-->

<template>
  <div id="topics" style="float: left">
    <h3>Add new topic</h3>
    <input v-model="topicToAdd" placeholder="Add topic here"/>
    <button @click="addNewTopic()">Add new topic</button>
    <p class="topics" v-for="topic of subscripedTopics" v-bind:key="topic">
      <span @click="setCurrentTopic">{{ topic }}</span> <button @click="removeTopic(topic)">Delete</button>
    </p>
  </div>
  <h1>Chat von Oliver</h1>
  <h2>ClientID:</h2>
  <button @click="connect">Connect</button>
  <input v-model="clientId" placeholder="ClientID" />
  <ChatComponent @send="sendMessage" :messages="messages"/>
  <!--HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/-->
</template>

<script lang="ts">
// import { arrayExpression } from '@babel/types';
import { defineComponent } from 'vue';
import ChatComponent from './components/Chat.vue';
import { Message } from './Models/Message';
import * as paho_mqtt from 'paho-mqtt' 
// import HelloWorld from './components/HelloWorld.vue';

var client : paho_mqtt.Client;

export default defineComponent({
  mounted(){
    //this.client = mqtt.connect(this.options);
    
  },
  data(){
    return {
      data: {
        mqtt_server: '7474707a29f3455eb46105db5cd34323.s2.eu.hivemq.cloud',
        mqtt_port: 8884,
        protocol: 'mqtts',
        username: 'oliver.the.explorer',
        password: 'jeZUbNM8YbU9S5T',

        messages: [],
      },
      receiveNews: "",
      subscribeSuccess: false,
      connecting: false,
      retryTimes: 0,


      subscripedTopics: <string[]> [],
      currentPublishTopic: "",
      messages: <Message[]> [],
      clientId: <string> "",
      topicToAdd: "",
    }
  },
  created(){
    
  },
  methods: {
    connect(){
      let self = this;
      console.log('connecting ...');

      // Create a client instance     
      client = new paho_mqtt.Client(self.data.mqtt_server, self.data.mqtt_port, this.clientId);


      client.connect(
        {
          userName: this.data.username,
          password: this.data.password,
          onSuccess: onConnect,
          useSSL: true,
        }
      );

      // set callback handlers
      client.onConnectionLost = onConnectionLost;
      client.onMessageArrived = onMessageArrived;

      // called when the client connects
      function onConnect() {
        // Once a connection has been made, make a subscription and send a message.
        console.log("onConnect");
/*
For later Reference
        let message = new Paho.MQTT.Message("Web client connected!");
        message.destinationName = self.publish_topic;
        client.send(message);
        */
      }

      // called when the client loses its connection
      function onConnectionLost(responseObject: paho_mqtt.MQTTError) {
        if (responseObject.errorCode !== 0) {
          console.log("onConnectionLost:" + responseObject.errorMessage);
        }
      }

      // called when a message arrives
      function onMessageArrived(message: paho_mqtt.Message) {
        console.log("onMessageArrived:" + message.payloadString);
        self.messages.unshift({
         clientId: message.destinationName,
         text: message.payloadString,
         topic: message.destinationName, 
        });
        
      }
    },
    sendMessage(msg=''){
      console.log("Das Kind will eine Nachricht senden: " + msg);
      let utf8Encode = new TextEncoder();

      client.send(this.currentPublishTopic, msg);
    },
    addNewTopic(){
      if(this.subscripedTopics.indexOf(this.topicToAdd) > -1) return;
      this.subscripedTopics.push(this.topicToAdd);
      client.subscribe(this.topicToAdd);
      this.topicToAdd = "";
    },
    removeTopic(topic: string): void{
      const index = this.subscripedTopics.indexOf(topic);
      this.subscripedTopics.splice(index, 1);
      client.unsubscribe(topic);
    },
    setCurrentTopic(event: Event){
      const clickedElement = (<HTMLSpanElement> event.target!);
      this.currentPublishTopic = clickedElement.innerText;
      console.log(this.currentPublishTopic);

      document.querySelectorAll('.topics').forEach(element => {
        (<HTMLElement>element).style.background = "#fff";
      });

      clickedElement.parentElement!.style.background = "#f00";

      // this.mqttClient = mqtt.connect('mqtts://7474707a29f3455eb46105db5cd34323.s2.eu.hivemq.cloud:8884') as Client
/*
      this.options.clientId = this.clientId;

      this.client = mqtt.connect(this.options);

      this.client.on('connect', this.connect)
      

    },
    connect(){
        console.log('Connected')
        // Subscribe to a topic
        this.subscripedTopics.forEach(topic =>
          this.client.subscribe(topic)
        )
        */
    },
    
  },
  components: {
    ChatComponent
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#topics{
  height: 1080px;
  width: 250px;
}
</style>
