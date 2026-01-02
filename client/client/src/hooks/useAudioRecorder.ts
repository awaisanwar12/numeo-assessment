import { useState,useEffect, useRef, useCallback } from "react";
import {io,Socket} from "socket.io-client";
import {useStore} from "../store/useStore";

 const SAMPLE_RATE=16000;

 export const useAudioRecorder=()=>{
    const [socket, setSocket] =useState<Socket|null>(null);
    const {
        isRecording,
        setIsRecording,
        setCurrentTranscript,
        addTranslation,
        targetLanguage} = useStore();
        const processorRef=useRef<ScriptProcessorNode|null>(null);
        const audioContextRef=useRef<AudioContext|null>(null);
        const streamRef =useRef<MediaStream|null>(null);
        useEffect(()=> {
            const newSocket = io('http://localhost:5000');
            setSocket(newSocket);
            newSocket.on('connect', ()=>{
                console.log('Connected to server via Socket.IO');
            });
            newSocket.on('transcript', (data:{text:string, isFinal:boolean})=>{

setCurrentTranscript(data.text);

            });
            newSocket.on('translation',(data:{original:string, translated:string})=> {
                addTranslation(data);
            });
            return () => {
                newSocket.disconnect();}
        }, []);

        useEffect(()=>{
            if (socket){
                socket.emit('set-language', targetLanguage);
        }}, [targetLanguage, socket]);
        const startRecording = useCallback(async()=>{
            if(!socket) return;
            try{
                const stream = await navigator.mediaDevices.getUserMedia({audio:true});
                streamRef.current=stream;
                audioContextRef.current =new window.AudioContext({sampleRate:SAMPLE_RATE});
                const source = audioContextRef.current.createMediaStreamSource(stream);
                const processor = audioContextRef.current.createScriptProcessor(4096,1,1);
                processorRef.current= processor;
                source.connect(processor);
                processor.connect(audioContextRef.current.destination);
                processor.onaudioprocess= (e)=>{
                    const inputData = e.inputBuffer.getChannelData(0);
                    const pcmData = new Int16Array(inputData.length);
                    for (let i=0; i<inputData.length;i++){
                        const s = Math.max(-1, Math.min(1, inputData[i]));
                        pcmData[i]= s<0? s* 0x8000 : s * 0x7FFF;

                    }
                    socket.emit('audio-chunk',pcmData.buffer);


                };
                socket.emit('start-recording');
                setIsRecording(true);


            } catch (error) {
                console.error(" error accessing the microfone or audio", error);


            }
            } , [ socket, setIsRecording]);
            const stopRecording  = useCallback(()=>{

                if(streamRef.current){
                    streamRef.current.getTracks().forEach(track => track.stop());
                        
                    }
                    if(processorRef.current){
                        processorRef.current.disconnect();

                    }
                    if(audioContextRef.current){
                        audioContextRef.current.close();

                    }
                    if(socket){
                        socket.emit('stop-recording');

                    }
                    setIsRecording(false);

                },[socket,setIsRecording]);
                return {startRecording,stopRecording, isRecording};
            };


