const VERSION='18.1';
const stages=[
 {title:'Awakening Breath',time:60,img:'assets/sage/breath.png',voice:'Let the breath rise and fall. Sit tall with both feet grounded. Inhale gently as the hands float up. Exhale as they settle back down.'},
 {title:'Lift & Flow',time:60,img:'assets/sage/lift-flow.png',voice:'Lift slowly through the center. Let the arms float as if supported by warm water. Release without forcing.'},
 {title:'Flowing Arms',time:60,img:'assets/sage/flowing-arms.png',voice:'Let the arms drift from side to side. Keep the shoulders soft and the breath easy.'},
 {title:'Gather Qi',time:60,img:'assets/sage/gather-qi.png',voice:'Gather calm energy toward the heart. Let the hands return to center with quiet attention.'},
 {title:'Stillness',time:60,img:'assets/sage/stillness.png',voice:'Rest in stillness. Notice the breath. Let the body settle.'},
 {title:'Closing',time:60,img:'assets/sage/closing.png',voice:'Let the hands lower gently. Carry this calm into the rest of your day.'},
 {title:'Final Bow',time:35,img:'assets/sage/bow.png',voice:'Bow gently to the practice, to your body, and to the stillness within.'}
];
const defaults={mode:'voiceMusic',voiceName:'Google UK English Male',speed:.95,pitch:.9,voiceVol:.78,musicVol:.22};
let state=JSON.parse(localStorage.getItem('stillwaterSettings')||'null')||defaults;
let i=0,remaining=stages[0].time,paused=true,tick=null,voices=[],musicIndex=0;
const musicFiles=['assets/audio/breath.mp3','assets/audio/flow.mp3','assets/audio/stillness.mp3','assets/audio/closing.mp3'];
const audio=new Audio(); audio.loop=false; audio.addEventListener('ended',()=>{musicIndex=(musicIndex+1)%musicFiles.length; playMusic();});
const $=id=>document.getElementById(id);
function save(){localStorage.setItem('stillwaterSettings',JSON.stringify(state));}
function fillStages(){ $('stageList').innerHTML=stages.map((s,n)=>`<li data-i="${n}"><span class="num">${n+1}</span>${s.title}</li>`).join(''); document.querySelectorAll('#stageList li').forEach(li=>li.onclick=()=>go(+li.dataset.i));}
function loadVoices(){voices=speechSynthesis.getVoices(); const sel=$('voiceSelect'); sel.innerHTML=''; voices.forEach(v=>{let o=document.createElement('option');o.value=v.name;o.textContent=`${v.name} (${v.lang})`;sel.appendChild(o)}); const preferred=voices.find(v=>v.name.includes(state.voiceName))||voices.find(v=>v.lang==='en-GB')||voices[0]; if(preferred){sel.value=preferred.name; state.voiceName=preferred.name; save();}}
speechSynthesis.onvoiceschanged=loadVoices;
function applySettings(){['speed','pitch','voiceVol','musicVol'].forEach(id=>$(id).value=state[id]); document.querySelectorAll('.modes button').forEach(b=>b.classList.toggle('active',b.dataset.mode===state.mode)); $('modeLabel').textContent={voiceMusic:'Voice + Music',voiceOnly:'Voice Only',musicOnly:'Music Only',silence:'Silence'}[state.mode]; audio.volume=state.musicVol; if(state.mode==='voiceOnly'||state.mode==='silence') audio.pause(); else if(!paused) playMusic();}
function render(){const s=stages[i]; $('stageNum').textContent=`STAGE ${i+1}`;$('stageTitle').textContent=s.title;$('instruction').textContent=s.voice;$('timer').textContent=fmt(remaining);$('progressBar').style.width=`${100*(1-remaining/s.time)}%`;document.querySelectorAll('#stageList li').forEach((li,n)=>li.classList.toggle('active',n===i)); const img=$('sageImg'); img.onerror=()=>{img.onerror=null; img.src='assets/sage/idle.png'}; img.src=s.img+`?v=${VERSION}`;}
function fmt(t){return `${Math.floor(t/60)}:${String(t%60).padStart(2,'0')}`}
function speak(){speechSynthesis.cancel(); if(state.mode==='musicOnly'||state.mode==='silence')return; const u=new SpeechSynthesisUtterance(stages[i].voice); const v=voices.find(v=>v.name===$('voiceSelect').value)||voices[0]; if(v)u.voice=v; u.rate=+state.speed; u.pitch=+state.pitch; u.volume=+state.voiceVol; try{speechSynthesis.speak(u)}catch(e){}}
function playMusic(){if(state.mode==='voiceOnly'||state.mode==='silence')return; audio.src=musicFiles[musicIndex]; audio.volume=state.musicVol; audio.play().catch(()=>{$('unlockBtn').classList.remove('hidden')});}
function startPractice(){ $('opening').classList.add('hidden');$('practice').classList.remove('hidden');document.querySelector('.practice-only').classList.remove('hidden');paused=false;$('pauseBtn').textContent='Pause';render();playMusic();speak();clearInterval(tick);tick=setInterval(()=>{if(paused)return; remaining--; if(remaining<=0){go(Math.min(i+1,stages.length-1)); return;} render();},1000);}
function go(n){i=n;remaining=stages[i].time;render(); if(!paused) speak();}
$('beginBtn').onclick=startPractice;$('unlockBtn').onclick=()=>{playMusic();speak();$('unlockBtn').classList.add('hidden')};$('pauseBtn').onclick=()=>{paused=!paused;$('pauseBtn').textContent=paused?'Resume':'Pause'; if(paused){audio.pause();speechSynthesis.pause()}else{speechSynthesis.resume();playMusic()}};$('backBtn').onclick=()=>go(Math.max(0,i-1));$('forwardBtn').onclick=()=>go(Math.min(stages.length-1,i+1));$('settingsToggle').onclick=()=>$('settings').classList.toggle('collapsed');$('settingsOpenBtn').onclick=()=>$('settings').classList.remove('collapsed');document.querySelectorAll('.modes button').forEach(b=>b.onclick=()=>{state.mode=b.dataset.mode;save();applySettings(); if(!paused){playMusic();speak();}});['speed','pitch','voiceVol','musicVol'].forEach(id=>$(id).oninput=e=>{state[id]=+e.target.value;save();applySettings();});$('voiceSelect').onchange=e=>{state.voiceName=e.target.value;save();};
fillStages();loadVoices();applySettings();render();
