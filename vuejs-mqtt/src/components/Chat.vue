<template>
    <!--Div für die Darstellung aller Chats-->
    <div id="chat">
        <p v-for="m in messages">
            {{ m.text }}
        </p>
    </div>
    <div>
        <input name="sendMessage" placeholder="Nachricht" v-model="message"/>
        <button @click="sendClick">Send</button>
    </div>
</template>

<script lang="ts">
import { Message } from '../Models/Message';
import { PropType, defineComponent } from 'vue'

export default defineComponent({
    setup() {

    },
    data(){
        return {
            message: "",
        }
    },
    methods: {
        sendClick(e: Event){
            this.$emit("send", this.message)
        }
    },
    props:{
        messages: Array as PropType<Message[]>
    }
})
</script>

<style scoped>
    #chat{
        height: 300px;
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
