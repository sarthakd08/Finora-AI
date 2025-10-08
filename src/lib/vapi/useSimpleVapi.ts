'use client';

import { useState, useEffect, useCallback } from 'react';
import { simpleVapiClient, type VapiCallState } from './simple-client';

export function useSimpleVapi() {
  const [state, setState] = useState<VapiCallState>({
    isActive: false,
    isConnecting: false,
    isMuted: false,
    error: null,
    messages: [],
    streamingMessage: null,
  });

  useEffect(() => {
    // Subscribe to state changes
    const unsubscribe = simpleVapiClient.subscribe((newState) => {
      setState(newState);
    });

    // Initial state sync
    setState({
      isActive: simpleVapiClient.isActive,
      isConnecting: simpleVapiClient.isConnecting,
      isMuted: simpleVapiClient.isMuted,
      error: simpleVapiClient.error,
      messages: simpleVapiClient.messages,
      streamingMessage: simpleVapiClient.streamingMessage,
    });

    return unsubscribe;
  }, []);

  const startCall = useCallback((assistantId: string) => {
    return simpleVapiClient.startCall(assistantId);
  }, []);

  const endCall = useCallback(() => {
    return simpleVapiClient.endCall();
  }, []);

  const toggleMute = useCallback(() => {
    return simpleVapiClient.toggleMute();
  }, []);

  const clearMessages = useCallback(() => {
    return simpleVapiClient.clearMessages();
  }, []);

  return {
    isActive: state.isActive,
    isConnecting: state.isConnecting,
    isMuted: state.isMuted,
    error: state.error,
    messages: state.messages,
    streamingMessage: state.streamingMessage,
    startCall,
    endCall,
    toggleMute,
    clearMessages,
  };
}
