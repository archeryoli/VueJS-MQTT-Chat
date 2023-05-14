<template>
    <!--Div für die Darstellung aller Chats-->
    <div id="chat">
        <message-component v-for="m in messages" 
            :userName="m.clientId" :topic="m.topic" :message="m.text" :isOwnMessage="m.clientId == clientId" :key="m.clientId">
        </message-component>
    </div>
    <div>
        <input name="sendMessage" placeholder="Nachricht" v-model="message" @keypress.enter="sendClick"/>
        <button @click="sendClick">Send</button>
    </div>
</template>

<script lang="ts">
import { Message } from '../Models/Message';
import { PropType, defineComponent } from 'vue'
import MessageComponent from './MessageComponent.vue';

export default defineComponent({
    components: { MessageComponent },
    data(){
        return {
            message: "",
        }
    },
    methods: {
        sendClick(e: Event){
            this.$emit("send", this.message)
            console.log(this.clientId);
            this.message = "";
        }
    },
    props:{
        messages: Array as PropType<Message[]>,
        clientId: String
    },
})
</script>

<style scoped>
    #chat{
        height: 600px;
        border: 1px solid black;
        width: 50%;
        margin: auto;
        overflow-y: scroll;
    }
    input{
        width: 45%;
        height: 50px;
    }
    button{
        width: 5%;
        height: 55px;
    }
</style>
