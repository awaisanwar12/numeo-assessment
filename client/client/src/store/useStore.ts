
import {create} from 'zustand';
interface TranslationItem{
    original :string;
    translated:string;
    timestamp:number;}
    interface AppState{
        isRecording:boolean;
        currentTranscript:string;
        translation:TranslationItem[];
        targetLanguage:string;
        setIsRecording:(isRecording:boolean)=>void;
        setCurrentTranscript:(text:string)=>void;
        addTranslation:(item: Omit<TranslationItem,'timestamp'>)=>void;
        setTargetLanguage:(lang:string)=>void;
        clearSession:()=>void;}
        export const useStore=create<AppState>((set: any)=>({
            isRecording:false,
            currentTranscript:'',
            translation:[],
            targetLanguage:'es',
            setIsRecording:(isRecording)=>set({isRecording}),
            setCurrentTranscript:(text)=>set({currentTranscript:text}),
    addTranslation:(item)=> set((state)=>({
        translations:[
            ...state.translation,
            {...item,timestamp:Date.now()}]})),

        setTargetLanguage: (lang) => set({ targetLanguage: lang }),
        clearSession:()=> set({
            currentTranscript:'',
            translation:[]})}));
            