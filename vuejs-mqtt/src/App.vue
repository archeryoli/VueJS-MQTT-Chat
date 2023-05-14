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
  <input v-model="clientId" placeholder="ClientID" />
  <ChatComponent @send="sendMessage"/>
  <!--HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/-->
</template>

<script lang="ts">
// import { arrayExpression } from '@babel/types';
import { defineComponent } from 'vue';
import ChatComponent from './components/Chat.vue';
import { Message } from './Models/Message';
import mqtt, { Client } from 'mqtt';
// import HelloWorld from './components/HelloWorld.vue';

export default defineComponent({
  mounted(){
    //this.client = mqtt.connect(this.options);
    
  },
  data(){
    return {
      options: {
        host: '7474707a29f3455eb46105db5cd34323.s2.eu.hivemq.cloud',
        port: 8883,
        protocol: 'mqtts',
        username: 'oliver.the.explorer',
        password: 'jeZUbNM8YbU9S5T',
      },
      mqttClient: <Client> mqtt.connect('mqtts://7474707a29f3455eb46105db5cd34323.s2.eu.hivemq.cloud:8884') as Client,
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
    sendMessage(msg=''){
      console.log("Das Kind will eine Nachricht senden: " + msg);
    },
    addNewTopic(){
      if(this.subscripedTopics.indexOf(this.topicToAdd) > -1) return;
      this.subscripedTopics.push(this.topicToAdd);
      this.topicToAdd = "";
    },
    removeTopic(topic: string): void{
      const index = this.subscripedTopics.indexOf(topic);
      this.subscripedTopics.splice(index, 1);
    },
    setCurrentTopic(event: Event){
      const clickedElement = (<HTMLSpanElement> event.target!);
      this.currentPublishTopic = clickedElement.innerText;
      console.log(this.currentPublishTopic);

      document.querySelectorAll('.topics').forEach(element => {
        (<HTMLElement>element).style.background = "#fff";
      });

      clickedElement.parentElement!.style.background = "#f00";

      this.mqttClient = mqtt.connect('mqtts://7474707a29f3455eb46105db5cd34323.s2.eu.hivemq.cloud:8884') as Client;

      this.mqttClient.on('connect', () => {
        console.log("connected");
      })
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
