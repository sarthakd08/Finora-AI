'use client';

import Vapi from '@vapi-ai/web';

export interface VapiCallState {
  isActive: boolean;
  isConnecting: boolean;
  isMuted: boolean;
  error: string | null;
  messages: Array<{ speaker: string; text: string; timestamp: string }>;
  streamingMessage: { speaker: string; text: string } | null;
}

export class SimpleVapiClient {
  private vapi: Vapi | null = null;
  private state: VapiCallState = {
    isActive: false,
    isConnecting: false,
    isMuted: false,
    error: null,
    messages: [],
    streamingMessage: null,
  };
  private listeners: ((state: VapiCallState) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeVapi();
    } else {
      console.warn('⚠️ Vapi client can only be initialized in browser environment');
    }
  }

  private initializeVapi() {
    try {
      const apiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY;
      if (!apiKey) {
        console.error('❌ VAPI_API_KEY not found in environment variables');
        this.updateState({ error: 'VAPI_API_KEY not found in environment variables' });
        return;
      }

      console.log('🔧 Initializing Vapi with API key...');
      this.vapi = new Vapi(apiKey);
      this.setupEventListeners();
      console.log('✅ Vapi client initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Vapi client:', error);
      this.updateState({ error: error instanceof Error ? error.message : 'Failed to initialize' });
    }
  }

  private setupEventListeners() {
    if (!this.vapi) return;

    // Call started
    this.vapi.on('call-start', () => {
      console.log('📞 Call started');
      this.updateState({ 
        isActive: true, 
        isConnecting: false, 
        error: null 
      });
    });

    // Call ended
    this.vapi.on('call-end', () => {
      console.log('📞 Call ended');
      this.updateState({ 
        isActive: false, 
        isConnecting: false 
      });
    });

    // Message received
    this.vapi.on('message', (message: unknown) => {
      console.log('📨 Vapi message received:', message);
      
      // Extract message data and add to transcript
      if (message && typeof message === 'object') {
        const messageObj = message as Record<string, unknown>;
        
        const isFinal = messageObj.isFinal === true || messageObj.final === true || messageObj.type === 'final';
        const messageText = (messageObj.message || messageObj.text || messageObj.content || 'Unknown message') as string;
        const speaker = messageObj.type === 'user' ? 'user' : 'agent';
        const timestamp = new Date().toISOString();
        
        if (isFinal) {
          // Final message - add to transcript and clear streaming
          const newMessage = {
            speaker,
            text: messageText,
            timestamp
          };
          
          this.updateState({
            messages: [...this.state.messages, newMessage],
            streamingMessage: null
          });
          
          console.log('✅ Final message added to transcript:', newMessage);
        } else {
          // Streaming message - show as typing indicator
          this.updateState({
            streamingMessage: {
              speaker,
              text: messageText
            }
          });
          
          console.log('⏳ Streaming message updated:', messageText);
        }
      }
    });

    // Speech started
    this.vapi.on('speech-start', () => {
      console.log('🎤 Speech started');
    });

    // Speech ended
    this.vapi.on('speech-end', () => {
      console.log('🎤 Speech ended');
    });

    // Volume level
    this.vapi.on('volume-level', () => {
      // console.log('🔊 Volume level detected');
    });

    // Error occurred
    this.vapi.on('error', (error: unknown) => {
      console.error('❌ Vapi error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.updateState({ 
        error: errorMessage,
        isConnecting: false 
      });
    });
  }

  async startCall(assistantId: string) {
    if (!this.vapi) {
      const error = 'Vapi client not initialized. Please check your API key.';
      console.error('❌', error);
      this.updateState({ error });
      throw new Error(error);
    }

    if (this.state.isActive || this.state.isConnecting) {
      console.warn('⚠️ Call already active or connecting');
      return;
    }

    try {
      console.log('🚀 Starting Vapi call with assistant:', assistantId);
      this.updateState({ isConnecting: true, error: null });
      
      // Use the correct Vapi API format
      await this.vapi.start(assistantId);

      console.log('✅ Call started successfully');
    } catch (error) {
      console.error('❌ Failed to start call:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to start call';
      this.updateState({ 
        error: errorMessage,
        isConnecting: false 
      });
      throw error;
    }
  }

  async endCall() {
    if (!this.vapi) {
      throw new Error('Vapi client not initialized');
    }

    try {
      await this.vapi.stop();
      console.log('📞 Call ended successfully');
    } catch (error) {
      console.error('❌ Failed to end call:', error);
      throw error;
    }
  }

  async toggleMute() {
    if (!this.vapi || !this.state.isActive) {
      return;
    }

    try {
      this.state.isMuted = !this.state.isMuted;
      this.vapi.setMuted(this.state.isMuted);
      this.notifyListeners();
      console.log(`🔇 Mute ${this.state.isMuted ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('❌ Failed to toggle mute:', error);
      throw error;
    }
  }

  clearMessages() {
    this.updateState({ 
      messages: [],
      streamingMessage: null
    });
    console.log('🗑️ Messages cleared');
  }

  private updateState(updates: Partial<VapiCallState>) {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }

  // Getters
  get isActive() { return this.state.isActive; }
  get isConnecting() { return this.state.isConnecting; }
  get isMuted() { return this.state.isMuted; }
  get error() { return this.state.error; }
  get messages() { return this.state.messages; }
  get streamingMessage() { return this.state.streamingMessage; }

  // Subscribe to state changes
  subscribe(listener: (state: VapiCallState) => void) {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
}

// Create singleton instance
export const simpleVapiClient = new SimpleVapiClient();
