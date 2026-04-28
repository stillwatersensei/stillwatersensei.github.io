/* Stillwater Sensei v16.3
   Four audio modes + remembered settings + browser voice selector + calmer breathing ripple.
   GitHub Pages friendly. No external dependencies. */

const APP_VERSION = "16.3";
const SETTINGS_KEY = "stillwaterAudioSettings.v16";

const defaultSettings = {
  audioMode: "both",
  musicVolume: 0.20,
  voiceVolume: 0.70,
  voiceRate: 0.72,
  voicePitch: 1.08,
  voiceName: "Microsoft Zira - English (United States)"
};

const stages = [
  { id: "breath", title: "Awakening Breath", eyebrow: "Stage 1", duration: 60, image: "assets/sage/breath.png", music: "assets/audio/breath.mp3", voice: "assets/voice/01-awakening-breath.mp3", voiceText: "Welcome to Stillwater. Sit tall in your chair. Let your feet rest gently. Soften your shoulders, and take a slow breath in. Now breathe out, easy and calm.", description: "Sit tall, soften your shoulders, and let the breath become slow and steady." },
  { id: "lift-flow", title: "Lift & Flow", eyebrow: "Stage 2", duration: 70, image: "assets/sage/lift-flow.png", music: "assets/audio/flow.mp3", voice: "assets/voice/02-lift-flow.mp3", voiceText: "Float your hands upward as if lifting light from the water. Let them settle slowly. Keep the shoulders easy and the movement soft.", description: "Float the hands upward with ease, then let them settle like water returning to a quiet pond." },
  { id: "flowing-arms", title: "Flowing Arms", eyebrow: "Stage 3", duration: 70, image: "assets/sage/flowing-arms.png", music: "assets/audio/flow.mp3", voice: "assets/voice/03-flowing-arms.mp3", voiceText: "Let the arms flow gently from side to side. Move only as far as feels comfortable. Imagine water moving around a smooth stone.", description: "Move gently from side to side, keeping the motion soft, rounded, and comfortable." },
  { id: "gather-qi", title: "Gather Qi", eyebrow: "Stage 4", duration: 70, image: "assets/sage/gather-qi.png", music: "assets/audio/flow.mp3", voice: "assets/voice/04-gather-qi.mp3", voiceText: "Gather calm toward the center. Breathe in steadiness. Breathe out tension. Let the hands return softly toward the body.", description: "Gather calm energy toward the center, breathing in steadiness and breathing out tension." },
  { id: "stillness", title: "Stillness", eyebrow: "Stage 5", duration: 80, image: "assets/sage/stillness.png", music: "assets/audio/stillness.mp3", voice: "assets/voice/05-stillness.mp3", voiceText: "Rest in stillness. Feel the chair supporting you. Let the breath move naturally. Nothing to force. Nothing to chase.", description: "Rest in quiet awareness. Let the body be supported and the mind become spacious." },
  { id: "closing", title: "Closing", eyebrow: "Stage 6", duration: 55, image: "assets/sage/closing.png", music: "assets/audio/closing.mp3", voice: "assets/voice/06-closing.mp3", voiceText: "Begin to return. Notice your hands, your feet, and the space around you. Carry this calm with you.", description: "Return slowly, noticing the chair beneath you and the calm you have created." },
  { id: "bow", title: "Final Bow", eyebrow: "Stage 7", duration: 25, image: "assets/sage/bow.png", music: "assets/audio/closing.mp3", voice: "assets/voice/07-final-bow.mp3", voiceText: "Thank you for practicing with Stillwater. Bow gently to your practice, and carry stillness into the rest of your day.", description: "Bow gently to your practice. Carry stillness with you into the rest of your day." }
];

const musicTracks = [
  "assets/audio/breath.mp3",
  "assets/audio/flow.mp3",
  "assets/audio/stillness.mp3",
  "assets/audio/closing.mp3"
];

const $ = (id) => document.getElementById(id);
const els = {
  sageImage: $("sageImage"), stageEyebrow: $("stageEyebrow"), stageTitle: $("stageTitle"), stageDescription: $("stageDescription"), timerText: $("timerText"), progressFill: $("progressFill"),
  backButton: $("backButton"), nextButton: $("nextButton"), startPauseButton: $("startPauseButton"), soundToggle: $("soundToggle"), stageList: $("stageList"),
  musicVolume: $("musicVolume"), voiceVolume: $("voiceVolume"), voiceRate: $("voiceRate"), voicePitch: $("voicePitch"), voiceSelect: $("voiceSelect"),
  voiceStatus: $("voiceStatus"), audioSummary: $("audioSummary"), audioDetails: $("audioDetails"),
  modeButtons: Array.from(document.querySelectorAll(".mode-button"))
};

let currentStageIndex = 0;
let remainingSeconds = stages[0].duration;
let timerId = null;
let isRunning = false;
let audioMode = defaultSettings.audioMode;
let currentMusic = null;
let currentMusicTrackIndex = 0;
let currentVoice = null;
let speechUtterance = null;
let lastVoiceStageId = null;
let voices = [];

function loadSettings() {
  try { return { ...defaultSettings, ...(JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}) }; }
  catch { return { ...defaultSettings }; }
}

function saveSettings() {
  const settings = {
    audioMode,
    musicVolume: Number(els.musicVolume?.value ?? defaultSettings.musicVolume),
    voiceVolume: Number(els.voiceVolume?.value ?? defaultSettings.voiceVolume),
    voiceRate: Number(els.voiceRate?.value ?? defaultSettings.voiceRate),
    voicePitch: Number(els.voicePitch?.value ?? defaultSettings.voicePitch),
    voiceName: els.voiceSelect?.value || defaultSettings.voiceName
  };
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch { /* ignore */ }
}

function applySettings() {
  const settings = loadSettings();
  audioMode = settings.audioMode || defaultSettings.audioMode;
  if (els.musicVolume) els.musicVolume.value = settings.musicVolume;
  if (els.voiceVolume) els.voiceVolume.value = settings.voiceVolume;
  if (els.voiceRate) els.voiceRate.value = settings.voiceRate;
  if (els.voicePitch) els.voicePitch.value = settings.voicePitch;
}

function withVersion(path) { return `${path}?v=${APP_VERSION}`; }
function formatTime(seconds) { return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`; }
function wantsMusic() { return audioMode === "both" || audioMode === "music"; }
function wantsVoice() { return audioMode === "both" || audioMode === "voice"; }
function modeLabel(mode) { return mode === "both" ? "Voice + Music" : mode === "voice" ? "Voice Only" : mode === "music" ? "Music Only" : "Silence"; }

function populateVoiceSelect() {
  if (!els.voiceSelect || !window.speechSynthesis) return;
  const saved = loadSettings();
  voices = window.speechSynthesis.getVoices();
  els.voiceSelect.innerHTML = "";
  if (!voices.length) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "Loading browser voices...";
    els.voiceSelect.appendChild(opt);
    return;
  }
  voices.forEach((voice) => {
    const opt = document.createElement("option");
    opt.value = voice.name;
    opt.textContent = `${voice.name} (${voice.lang})`;
    els.voiceSelect.appendChild(opt);
  });
  const preferred = voices.find(v => v.name === saved.voiceName)
    || voices.find(v => v.name.includes("Microsoft Zira"))
    || voices.find(v => v.lang.toLowerCase().startsWith("en-us"))
    || voices[0];
  els.voiceSelect.value = preferred.name;
  saveSettings();
}

function selectedVoice() {
  if (!els.voiceSelect) return null;
  return voices.find(v => v.name === els.voiceSelect.value) || null;
}

function buildStageList() {
  if (!els.stageList) return;
  els.stageList.innerHTML = "";
  stages.forEach((stage, index) => {
    const item = document.createElement("li");
    item.innerHTML = `<span class="stage-dot" aria-hidden="true"></span><span>${stage.title}</span>`;
    item.addEventListener("click", () => goToStage(index, true));
    els.stageList.appendChild(item);
  });
}

function renderStage() {
  const stage = stages[currentStageIndex];
  if (!els.stageTitle) return;
  els.stageEyebrow.textContent = stage.eyebrow;
  els.stageTitle.textContent = stage.title;
  els.stageDescription.textContent = stage.description;
  els.timerText.textContent = isRunning ? formatTime(remainingSeconds) : (remainingSeconds === stage.duration ? "Ready" : formatTime(remainingSeconds));
  els.progressFill.style.width = `${100 - (remainingSeconds / stage.duration) * 100}%`;
  els.backButton.disabled = currentStageIndex === 0;
  els.nextButton.disabled = currentStageIndex === stages.length - 1;
  els.startPauseButton.textContent = isRunning ? "Pause" : (remainingSeconds < stage.duration ? "Resume" : "Begin");

  Array.from(els.stageList.children).forEach((item, index) => {
    item.classList.toggle("current", index === currentStageIndex);
    item.classList.toggle("done", index < currentStageIndex);
  });
  els.modeButtons.forEach((button) => {
    const active = button.dataset.mode === audioMode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  if (els.soundToggle) {
    els.soundToggle.textContent = modeLabel(audioMode);
    els.soundToggle.setAttribute("aria-pressed", String(audioMode !== "silence"));
  }
  if (els.audioSummary) els.audioSummary.textContent = modeLabel(audioMode);
  updateSageImage(stage.image);
}

function updateSageImage(src) {
  if (!els.sageImage) return;
  const versionedSrc = withVersion(src);
  if (els.sageImage.getAttribute("src") === versionedSrc) return;
  els.sageImage.classList.add("changing");
  window.setTimeout(() => { els.sageImage.src = versionedSrc; els.sageImage.classList.remove("changing"); }, 150);
}

function stopTimer() { if (timerId) window.clearInterval(timerId); timerId = null; isRunning = false; }
function tick() { if (remainingSeconds > 0) { remainingSeconds -= 1; renderStage(); return; } currentStageIndex < stages.length - 1 ? (goToStage(currentStageIndex + 1, true), startPractice()) : completePractice(); }

function startPractice() { if (isRunning) return; isRunning = true; startStageAudio(false); timerId = window.setInterval(tick, 1000); renderStage(); }
function pausePractice() { stopTimer(); pauseAudio(currentMusic); pauseAudio(currentVoice); stopBrowserSpeech(); renderStage(); }
function completePractice() { stopTimer(); stopAllAudio(); remainingSeconds = 0; if (els.timerText) els.timerText.textContent = "Done"; if (els.progressFill) els.progressFill.style.width = "100%"; if (els.startPauseButton) els.startPauseButton.textContent = "Begin Again"; }

function goToStage(index, resetTime = false) {
  const wasRunning = isRunning;
  stopTimer(); stopAudio(currentVoice); stopBrowserSpeech(); lastVoiceStageId = null;
  currentStageIndex = Math.max(0, Math.min(index, stages.length - 1));
  if (resetTime) remainingSeconds = stages[currentStageIndex].duration;
  renderStage();
  if (wasRunning) startPractice();
}

function makeAudio(src, volume, loop = false) { const audio = new Audio(withVersion(src)); audio.preload = "auto"; audio.volume = volume; audio.loop = loop; return audio; }
function playAudio(audio) { return audio ? audio.play() : Promise.resolve(); }
function pauseAudio(audio) { if (audio) audio.pause(); }
function stopAudio(audio) { if (!audio) return; audio.pause(); try { audio.currentTime = 0; } catch { /* ignore */ } }
function stopAllAudio() { stopAudio(currentMusic); stopAudio(currentVoice); stopBrowserSpeech(); }

function startStageAudio(forceVoiceReplay = false) {
  const stage = stages[currentStageIndex];
  if (wantsMusic()) startMusicFlow(); else stopAudio(currentMusic);
  if (wantsVoice()) startVoice(stage, forceVoiceReplay); else { stopAudio(currentVoice); stopBrowserSpeech(); }
}

function startMusicFlow() {
  if (!els.musicVolume || !musicTracks.length) return;
  if (!currentMusic) loadMusicTrack(currentMusicTrackIndex);
  currentMusic.volume = Number(els.musicVolume.value);
  currentMusic.loop = false;
  playAudio(currentMusic).catch(() => { if (els.voiceStatus) els.voiceStatus.textContent = "Music is ready. Tap Begin or the audio mode again if the browser blocks autoplay."; });
}

function loadMusicTrack(index) {
  const safeIndex = ((index % musicTracks.length) + musicTracks.length) % musicTracks.length;
  currentMusicTrackIndex = safeIndex;
  stopAudio(currentMusic);
  currentMusic = makeAudio(musicTracks[currentMusicTrackIndex], Number(els.musicVolume?.value ?? defaultSettings.musicVolume), false);
  currentMusic.addEventListener("ended", playNextMusicTrack);
}

function playNextMusicTrack() {
  if (!wantsMusic()) return;
  loadMusicTrack(currentMusicTrackIndex + 1);
  startMusicFlow();
}

function startVoice(stage, forceReplay = false) {
  if (!stage?.voiceText) return;
  if (!forceReplay && lastVoiceStageId === stage.id) return;
  stopAudio(currentVoice); stopBrowserSpeech(); lastVoiceStageId = stage.id;
  currentVoice = makeAudio(stage.voice, Number(els.voiceVolume?.value ?? defaultSettings.voiceVolume), false);
  currentVoice.addEventListener("error", () => { currentVoice = null; speakWithBrowserVoice(stage.voiceText); }, { once: true });
  playAudio(currentVoice).then(() => { if (els.voiceStatus) els.voiceStatus.textContent = "Playing local Sage voice MP3 for this stage."; }).catch(() => { currentVoice = null; speakWithBrowserVoice(stage.voiceText); });
}

function speakWithBrowserVoice(text) {
  if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) { if (els.voiceStatus) els.voiceStatus.textContent = "Voice unavailable: add local MP3 files in assets/voice/."; return; }
  stopBrowserSpeech();
  speechUtterance = new SpeechSynthesisUtterance(text);
  const voice = selectedVoice();
  if (voice) speechUtterance.voice = voice;
  speechUtterance.rate = Number(els.voiceRate?.value ?? defaultSettings.voiceRate);
  speechUtterance.pitch = Number(els.voicePitch?.value ?? defaultSettings.voicePitch);
  speechUtterance.volume = Number(els.voiceVolume?.value ?? defaultSettings.voiceVolume);
  speechUtterance.onstart = () => { if (els.voiceStatus) els.voiceStatus.textContent = "Using selected browser voice because no local Sage MP3 was found for this stage."; };
  speechUtterance.onerror = () => { if (els.voiceStatus) els.voiceStatus.textContent = "Browser voice was blocked. Tap Voice Only or Play Voice + Music again."; };
  window.speechSynthesis.speak(speechUtterance);
}

function stopBrowserSpeech() { if (window.speechSynthesis) window.speechSynthesis.cancel(); speechUtterance = null; }
function setAudioMode(mode) { audioMode = mode; saveSettings(); if (mode === "silence") stopAllAudio(); else startStageAudio(true); renderStage(); }
function cycleSoundToggle() { const order = ["both", "voice", "music", "silence"]; setAudioMode(order[(order.indexOf(audioMode) + 1) % order.length] || "both"); }

function attachEvents() {
  if (!els.startPauseButton) return;
  els.startPauseButton.addEventListener("click", () => { if (isRunning) pausePractice(); else if (remainingSeconds === 0 && currentStageIndex === stages.length - 1) { goToStage(0, true); startPractice(); } else startPractice(); });
  els.backButton.addEventListener("click", () => goToStage(currentStageIndex - 1, true));
  els.nextButton.addEventListener("click", () => goToStage(currentStageIndex + 1, true));
  els.soundToggle?.addEventListener("click", cycleSoundToggle);
  els.modeButtons.forEach((button) => button.addEventListener("click", () => setAudioMode(button.dataset.mode)));
  [els.musicVolume, els.voiceVolume, els.voiceRate, els.voicePitch, els.voiceSelect].forEach((control) => control?.addEventListener("input", () => { if (currentMusic && control === els.musicVolume) currentMusic.volume = Number(els.musicVolume.value); if (currentVoice && control === els.voiceVolume) currentVoice.volume = Number(els.voiceVolume.value); saveSettings(); }));
  els.voiceSelect?.addEventListener("change", saveSettings);
  document.addEventListener("visibilitychange", () => { if (document.hidden && isRunning) pausePractice(); });
}

applySettings();
populateVoiceSelect();
if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = populateVoiceSelect;
buildStageList();
attachEvents();
renderStage();
