import { useState, useEffect, useRef } from 'react';

export const useVoiceToText = (onTranscriptReceived) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('te-IN'); // Default to Telugu (can switch to en-IN)
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Voice recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (onTranscriptReceived && transcript) {
        // Feed into editable input box without sending
        onTranscriptReceived(transcript);
      }
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
      if (event.error !== 'no-speech') {
        setError(`Microphone error: ${event.error}`);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [language, onTranscriptReceived]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setError('Voice recognition is unavailable.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.lang = language;
        recognitionRef.current.start();
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  };

  return {
    isListening,
    error,
    language,
    setLanguage,
    toggleListening,
    isSupported: !!(window.SpeechRecognition || window.webkitSpeechRecognition),
  };
};
