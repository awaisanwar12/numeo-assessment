import { useStore } from './store/useStore';
import './App.css'
import {useAudioRecorder} from './hooks/useAudioRecorder'


const LANGUAGES = [ 
  { code: 'en', name: 'English' },
  {code:'ur',name:'Urdu'},
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
];
function App() {
const {
  currentTranscript, translation, targetLanguage,setTargetLanguage, clearSession
} = useStore();
const { startRecording, stopRecording , isRecording} = useAudioRecorder();

  return (
   <div  className='app-container'>
<header className='header'>

  <h1> Voice Translator</h1>
  <div className='controls'>
    <select  
    value={targetLanguage}
    onChange={(e)=>setTargetLanguage(e.target.value)}
    disabled={isRecording}
    className='lang-select'
    >
      {LANGUAGES.map(lang => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
    <button className={`record-btn ${isRecording? 'recording':''}`} onClick={isRecording? stopRecording:startRecording}>
      {isRecording ? 'Stop Recording' : 'Start Recording'}
    </button>

  </div>
</header>
<main className='transcript-section'> 
  <section>
    <h2>Live Transcript</h2>
    <div className='transcript-box'>
      {currentTranscript || <span className='placeholder'> Start speaking..</span>}
    </div>
  </section>
<section className='history-section' >
  
  <div className='history-header'>
    <h2>Translation History</h2>
    <button className='clear-history-btn' onClick={clearSession}>Clear History</button>
  </div>
  <div className='translation-list'>
    {translation.slice().reverse().map((item,index)=>(
  <div className='translation-card' key={index}> <p className='original-text'>{item.orginal}</p>
      <p className='translated-text'>{item.translated}</p>
    </div>))}
    {translation.length ===0 && (
    <div className='empty-state'> No translation yet</div>)}
  </div>

</section> 
</main>
   </div> )
}

export default App
