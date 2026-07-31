/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />
/// <reference types="dom-speech-recognition" />

/**
 * Web Speech 识别构造器在标准 lib.dom 中不存在，
 * @types/dom-speech-recognition 只声明了实例类型，这里补上 window 上的构造器。
 */
declare global {
  interface Window {
    SpeechRecognition?: typeof SpeechRecognition;
    webkitSpeechRecognition?: typeof SpeechRecognition;
    webkitAudioContext?: typeof AudioContext;
  }
}

export {};
