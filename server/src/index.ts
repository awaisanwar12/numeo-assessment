import  express  from "express";
import http from 'http';
import {Server} from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { AssemblyAI } from "assemblyai";
import { translatedText } from "./services/translator"; 

dotenv.config();
const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
    cors:{
        origin:"*",
        methods:["GET,POST"]
    }
});
const apiKey = process.env.ASSEMBLYAI_API_KEY;
if(!apiKey){
    console.error("no api is set or available")

}
const client = new AssemblyAI({
    apiKey:apiKey || ''
});
io.on ('connection', (socket)=>{
    console.log('client connected', socket.id);


let transcriber :any= null;
let isTranscriberReady = false;
let currentLang = 'es';


socket.on('set-language', (lang)=>{
currentLang =lang;
console.log(`target language set to : ${lang}`)
});
socket.on('start-recording',async()=>{
    console.log('starting recording session....')
    try {
        transcriber = client.streaming.transcriber({
            sampleRate:16000
        });
        isTranscriberReady =false
        transcriber.on('open', ({sessionId}:{sessionId:string})=>{
            console.log(`session opened with id : ${sessionId}`);
            isTranscriberReady =true ;
        });
        
        transcriber.on('error',(error:any)=>{
            console.log("transcriber errro", error)
        });
        transcriber.on('close', (code:number, reason:string)=>{
            console.log('session closed :', code, reason);

        });

    transcriber.on('turn', async(turn:any)=>{
        if(!turn.transcript) return;
        socket.emit('transcript',{
text: turn.transcript,
isFinal:turn.end_of_turn
        });
        if(turn.end_of_turn){
console.log(`Translating: "${turn.transcript}" to ${currentLang}`);
const translated = await translatedText(turn.transcript,currentLang);
socket.emit('translation',{
    original:turn.transcript,
translated:translated
});
    }});
await transcriber.connect();
console.log(" trasnciber conencted");

    
    
    } catch (error){

        console.error('error startingt transcriber', error)
        socket.emit("error", "failed to satrt transcription service. ")
    }
});
socket.on('audio-chunk', (data)=>{
    if(transcriber && isTranscriberReady){
        transcriber.sendAudio(data);
    }
})
socket.on('disconnect', async()=>{
    console.log("disconnected ")
if(transcriber){
    await transcriber.close();
}

})})
const PORT = process.env.PORT || 5000;

server.listen(PORT, ()=>{
    console.log(`server started on port ${PORT}`)
});