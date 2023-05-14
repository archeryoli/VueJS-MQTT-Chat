<!--https://www.emqx.com/en/blog/mqtt-js-tutorial-->

<template>
  <div class="row">
    <div id="topics" class="col-3">
      <div v-show="connected">
        <h3>Add new topic</h3>
        <input v-model="topicToAdd" placeholder="Add topic here"/>
        <button @click="addNewTopic()">Add new topic</button>
        <p class="topics" v-for="topic of subscripedTopics" v-bind:key="topic">
          <span @click="setCurrentTopic">{{ topic }}</span> <button @click="removeTopic(topic)">Delete</button>
        </p>
      </div>
    </div>

    <div id="chat" class="col-9">
      <h1>Chat App by Oliver</h1>
      <h2>ClientID:</h2>
      <input id="clientId" v-model="clientId" placeholder="ClientID" />
      <button id="connect" @click="connect">Connect</button>
      <ChatComponent @send="sendMessage" :messages="messages" :client-id="clientId"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ChatComponent from './components/Chat.vue';
import { Message } from './Models/Message';
import * as paho_mqtt from 'paho-mqtt' 

var client : paho_mqtt.Client;

export default defineComponent({
  data(){
    return {
      data: {
        mqtt_server: '7474707a29f3455eb46105db5cd34323.s2.eu.hivemq.cloud',
        mqtt_port: 8884,
        username: 'oliver.the.explorer',
        password: 'jeZUbNM8YbU9S5T',
      },
      connected: false,

      subscripedTopics: <string[]> [],
      currentPublishTopic: "",
      messages: <Message[]> [],
      clientId: <string> "",
      topicToAdd: "",
    }
  },
  methods: {
    connect() : void {
      let self = this;
      console.log('connecting ...');

      // Create a client instance     
      client = new paho_mqtt.Client(self.data.mqtt_server, self.data.mqtt_port, this.clientId);

      // connect to the broker
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
      function onConnect() : void {
        // Once a connection has been made, make a subscription and send a message.
        console.log("onConnect");
        (<HTMLInputElement> document.querySelector("#clientId")).disabled = true;
        (<HTMLButtonElement> document.querySelector("#connect")).disabled = true;

        // to show the topics menu
        self.connected = true;
      }

      // called when the client loses its connection
      function onConnectionLost(responseObject: paho_mqtt.MQTTError) : void {

        (<HTMLInputElement> document.querySelector("#clientId")).disabled = false;
        (<HTMLButtonElement> document.querySelector("#connect")).disabled = false;
        self.connected = false;

        alert("Client lost his connection! \nPlease Reconnect!")
        
        if (responseObject.errorCode !== 0) {
          console.log("onConnectionLost:" + responseObject.errorMessage);
        }
      }

      // called when a message arrives
      function onMessageArrived(message: paho_mqtt.Message) : void {
        console.log("onMessageArrived:" + message.payloadString);
        const userName = message.payloadString.split(String.fromCharCode(7))[0];
        const payload = message.payloadString.split(String.fromCharCode(7))[1];
        self.messages.unshift({
         clientId: userName,
         text: payload,
         topic: message.destinationName, 
        });
        
      }
    },
    sendMessage(msg: string=''): void{
      console.log("Das Kind will eine Nachricht senden: " + msg);

      const messageWithUsername = this.clientId + String.fromCharCode(7) + msg;

      client.send(this.currentPublishTopic, messageWithUsername);
    },
    addNewTopic(): void{
      if(this.subscripedTopics.indexOf(this.topicToAdd) > -1) return;

      if(this.subscripedTopics.length == 0){
        this.currentPublishTopic = this.topicToAdd;
      }

      this.subscripedTopics.push(this.topicToAdd);
      client.subscribe(this.topicToAdd);
      this.topicToAdd = "";

      
    },
    removeTopic(topic: string): void{
      const index = this.subscripedTopics.indexOf(topic);
      this.subscripedTopics.splice(index, 1);
      client.unsubscribe(topic);

      if(topic === this.currentPublishTopic){
        this.currentPublishTopic = "";
      }
    },
    setCurrentTopic(event: Event): void{
      const clickedElement = (<HTMLSpanElement> event.target);
      this.currentPublishTopic = clickedElement.innerText;
      console.log(this.currentPublishTopic);

      document.querySelectorAll('.topics').forEach(element => {
        (<HTMLElement>element).style.background = "#fff";
      });

      clickedElement.parentElement!.style.background = "#f00";
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
