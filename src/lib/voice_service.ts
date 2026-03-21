'use client';

/**
 * VoiceService: Integration with Web Speech API (Speech Recognition).
 * Purpose: Hands-free navigation during cooking.
 */

export const VoiceCommands = {
  NEXT: ['siguiente', 'paso siguiente', 'next'],
  PREV: ['atrás', 'anterior', 'back'],
  REPEAT: ['repite', 'repite paso', 'repeat'],
  WEIGHTS: ['pesos', 'gramos', 'weights'],
};

class VoiceService {
  private recognition: any = null;
  private onCommandCallback: (cmd: string) => void = () => {};

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = false;
        this.recognition.lang = 'es-ES';

        this.recognition.onresult = (event: any) => {
          const text = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
          console.log('[VoiceService] Detected:', text);
          this.processText(text);
        };

        this.recognition.onerror = (err: any) => console.error('[VoiceService] Error:', err);
      }
    }
  }

  private processText(text: string) {
    if (VoiceCommands.NEXT.some(c => text.includes(c))) this.onCommandCallback('NEXT');
    else if (VoiceCommands.PREV.some(c => text.includes(c))) this.onCommandCallback('PREV');
    else if (VoiceCommands.REPEAT.some(c => text.includes(c))) this.onCommandCallback('REPEAT');
    else if (VoiceCommands.WEIGHTS.some(c => text.includes(c))) this.onCommandCallback('WEIGHTS');
  }

  public start(callback: (cmd: string) => void) {
    if (!this.recognition) return console.warn('Speech Recognition not supported');
    this.onCommandCallback = callback;
    try {
      this.recognition.start();
      console.log('[VoiceService] Listening...');
    } catch (e) {
      console.warn('[VoiceService] Already started');
    }
  }

  public stop() {
    if (this.recognition) this.recognition.stop();
  }
}

export const voiceService = new VoiceService();
