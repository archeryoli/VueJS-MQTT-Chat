<template>
    <div :class="messageType">
        <div class="row">
            <div id="message" class="col">
                <p id="userName">{{ userName }}</p>
            </div>
            <div id="topic" class="col">
                <p id="topicParagraph">{{ topic }}</p>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <p>{{ message }}</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent ({
    props: {
        userName: String,
        topic: String,
        message: String,
        isOwnMessage: Boolean
    },
    computed: {
        messageType(): String{
            return this.isOwnMessage ? "ownMessage" : "otherMessage"
        }
    }
});
</script>

<style scoped>
    #userName{
        font-size: small;
        font-style: bold;
    }
    #topicParagraph{
        font-size: small;
    }
    .ownMessage{
        border: 1px solid black;
        border-radius: 15px 15px 0 15px;
        margin: 20px 20px 20px 120px;
        padding: 10px;
        text-align: start;
        background-color: lightgreen;
    }
    .otherMessage{
        border: 1px solid black;
        border-radius: 15px 15px 15px 0;
        margin: 20px 120px 20px 20px;
        padding: 10px;
        text-align: start;
        background-color: lightgray;

    }
</style>
<!--

    Hier ist eine etwas längere Nachricht um zu testen, ob das so auch funktioniert. Natürlich wäre das ein schönes Ergebnis, würde das beim ersten Versuch auf Anhieb funktionieren. Aber Sie kennen ja CSS, also vermutlich nicht.
-->