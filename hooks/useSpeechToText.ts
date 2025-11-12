
import { useState, useEffect, useRef, useCallback } from 'react';

const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

interface SpeechToTextOptions {
    onTranscriptChange: (text: string) => void;
}

export const useSpeechToText = ({ onTranscriptChange }: SpeechToTextOptions) => {
    const [isRecording, setIsRecording] = useState(false);
    const recognitionRef = useRef<any | null>(null);
    const finalTranscriptRef = useRef('');

    useEffect(() => {
        if (!SpeechRecognition) {
            console.error("SpeechRecognition API not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                const transcriptPart = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscriptRef.current += transcriptPart + ' ';
                } else {
                    interimTranscript += transcriptPart;
                }
            }
            onTranscriptChange(finalTranscriptRef.current + interimTranscript);
        };
        
        recognition.onend = () => {
            setIsRecording(false);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setIsRecording(false);
        };
        
        recognitionRef.current = recognition;

        return () => {
            recognition.stop();
        };
    }, [onTranscriptChange]);

    const startRecording = useCallback((initialText: string = '') => {
        if (recognitionRef.current && !isRecording) {
            finalTranscriptRef.current = initialText ? initialText.trim() + ' ' : '';
            recognitionRef.current.start();
            setIsRecording(true);
        }
    }, [isRecording]);

    const stopRecording = useCallback(() => {
        if (recognitionRef.current && isRecording) {
            recognitionRef.current.stop();
        }
    }, [isRecording]);

    return { 
        isRecording, 
        isSupported: !!SpeechRecognition, 
        startRecording, 
        stopRecording 
    };
};
