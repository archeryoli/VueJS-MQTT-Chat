export class Message {
    constructor(
        public clientId: string,
        public topic: string,
        public text: string
        ){}
}