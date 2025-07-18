import { useState, useEffect, useRef } from "react";
import { ChatModeSelector, chatModes } from "@/components/ChatModeSelector";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { ApiKeyInput } from "@/components/ApiKeyInput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChatMode, ChatMessage as ChatMessageType } from "@/types/chat";
import { GeminiApiService } from "@/services/geminiApi";
import { useToast } from "@/hooks/use-toast";
import { Bot, Settings, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const Index = () => {
  const [selectedMode, setSelectedMode] = useState<ChatMode>('customer-service');
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini-api-key') || '');
  const [showSettings, setShowSettings] = useState(!apiKey);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('gemini-api-key', apiKey);
  }, [apiKey]);

  const handleModeSelect = (mode: ChatMode) => {
    setSelectedMode(mode);
    // Add a welcome message when switching modes
    const modeConfig = chatModes.find(m => m.id === mode);
    if (modeConfig && messages.length === 0) {
      const welcomeMessage: ChatMessageType = {
        id: Date.now().toString(),
        content: getWelcomeMessage(mode),
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  };

  const getWelcomeMessage = (mode: ChatMode): string => {
    const welcomeMessages = {
      'customer-service': "Hello! I'm here to help you with any questions or issues you might have. How can I assist you today?",
      'mental-health': "Hi there. I'm here to listen and provide support. Remember, you're not alone, and it's okay to not be okay. What's on your mind today?",
      'learning': "Welcome to your learning session! I'm excited to help you explore new topics and understand complex concepts. What would you like to learn about today?",
      'fun-chat': "Hey there! Ready to have some fun? Whether you want to chat, play games, or just share some laughs, I'm here for it! What's up?"
    };
    return welcomeMessages[mode];
  };

  const handleSendMessage = async (content: string) => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API key first.",
        variant: "destructive"
      });
      setShowSettings(true);
      return;
    }

    // Add user message
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const geminiService = new GeminiApiService(apiKey);
      const modeConfig = chatModes.find(m => m.id === selectedMode);
      const prompt = modeConfig?.prompt || '';
      
      const response = await geminiService.generateResponse(prompt, content);

      const aiMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message. Please check your API key and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    const modeConfig = chatModes.find(m => m.id === selectedMode);
    if (modeConfig) {
      const welcomeMessage: ChatMessageType = {
        id: Date.now().toString(),
        content: getWelcomeMessage(selectedMode),
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  };

  const currentModeConfig = chatModes.find(m => m.id === selectedMode);

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto p-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">AI Chat Companion</h1>
              <p className="text-sm text-muted-foreground">Powered by Google Gemini</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-4 w-4" />
            </Button>
            {messages.length > 0 && (
              <Button
                variant="outline"
                size="icon"
                onClick={clearChat}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mb-6">
            <ApiKeyInput apiKey={apiKey} onApiKeyChange={setApiKey} />
          </div>
        )}

        {/* Mode Selector */}
        <div className="mb-6">
          <ChatModeSelector 
            selectedMode={selectedMode} 
            onModeSelect={handleModeSelect} 
          />
        </div>

        {/* Chat Interface */}
        <Card className={cn(
          "bg-gradient-card border-border/50 h-[600px] flex flex-col",
          currentModeConfig && `border-${currentModeConfig.color}/20`
        )}>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                currentModeConfig && `bg-${currentModeConfig.gradient}`
              )}>
                <Bot className="h-4 w-4 text-white" />
              </div>
              {currentModeConfig?.name} Mode
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-2">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Start a conversation with your AI companion!</p>
                </div>
              )}
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              disabled={!apiKey}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
