export interface AgentVoiceProfile {
  voice_id: string;
  name: string;
  style: string;
  pitch: number;
  rate: number;
  provider: string;
}

class VoiceService {
  speak(text: string, profile?: AgentVoiceProfile) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return false;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = profile?.pitch ?? 1;
    utterance.rate = profile?.rate ?? 1;

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0 && profile?.voice_id) {
      const voiceIndex = Number(profile.voice_id.replace(/\D/g, '')) % voices.length;
      utterance.voice = voices[voiceIndex];
    }

    window.speechSynthesis.speak(utterance);
    return true;
  }

  stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const voiceService = new VoiceService();
