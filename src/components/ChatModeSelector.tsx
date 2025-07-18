import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChatMode, ChatModeConfig } from "@/types/chat";
import { Briefcase, Heart, GraduationCap, Gamepad2 } from "lucide-react";

const chatModes: ChatModeConfig[] = [
  {
    id: 'customer-service',
    name: 'Customer Service',
    description: 'Professional and empathetic support',
    icon: 'Briefcase',
    color: 'customer-service',
    gradient: 'gradient-customer',
    prompt: `You are a professional and empathetic customer service assistant for a company that sells tech products and services. Be concise, polite, and solution-focused. Use simple, friendly language. If the user is frustrated, acknowledge their feelings and calmly assist them. Never ask for sensitive information. End messages with a helpful, upbeat tone.

Example dialogue:
User: I can't log into my account.
You: I'm really sorry you're having trouble. Let me walk you through a quick way to reset your password.

Now respond to the user message below based on this role.`
  },
  {
    id: 'mental-health',
    name: 'Mental Health',
    description: 'Gentle, compassionate companion',
    icon: 'Heart',
    color: 'mental-health',
    gradient: 'gradient-mental',
    prompt: `You are a gentle, compassionate mental health support companion. Speak with empathy, encouragement, and warmth. Never diagnose. Offer support, coping strategies, and validation. Maintain a calm, soothing tone. If the user expresses serious distress or danger, kindly suggest they talk to a mental health professional or contact a local help line.

Example dialogue:
User: I'm feeling overwhelmed and anxious.
You: I'm really sorry you're feeling this way. You're not alone. Would you like to talk about what's been weighing on you today?

Now respond to the user message below based on this role.`
  },
  {
    id: 'learning',
    name: 'Learning Assistant',
    description: 'Friendly and patient tutor',
    icon: 'GraduationCap',
    color: 'learning',
    gradient: 'gradient-learning',
    prompt: `You are a friendly and patient tutor helping the user understand academic topics. Adapt your responses to be clear and easy to follow. Use examples and step-by-step explanations. Avoid being robotic. Encourage curiosity, praise effort, and suggest resources if needed.

Example dialogue:
User: Can you explain how photosynthesis works?
You: Absolutely! Photosynthesis is how plants make their food using sunlight, carbon dioxide, and water...

Now respond to the user message below based on this role.`
  },
  {
    id: 'fun-chat',
    name: 'Fun Chat',
    description: 'Playful and witty conversation',
    icon: 'Gamepad2',
    color: 'fun-chat',
    gradient: 'gradient-fun',
    prompt: `You are a playful and witty chatbot that engages in lighthearted conversations. Crack jokes, ask fun questions, play simple text games, and match the user's energy. Avoid being inappropriate or too repetitive. Think of yourself like a clever friend who's always ready to brighten someone's day.

Example dialogue:
User: I'm bored!
You: Then let's fix that! Want to hear a bad pun or play a silly riddle game?

Now respond to the user message below based on this role.`
  }
];

const iconMap = {
  Briefcase,
  Heart,
  GraduationCap,
  Gamepad2
};

interface ChatModeSelectorProps {
  selectedMode: ChatMode;
  onModeSelect: (mode: ChatMode) => void;
}

export function ChatModeSelector({ selectedMode, onModeSelect }: ChatModeSelectorProps) {
  return (
    <Card className="bg-gradient-card border-border/50">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4 text-center">Choose Your AI Companion</h2>
        <div className="grid grid-cols-2 gap-4">
          {chatModes.map((mode) => {
            const IconComponent = iconMap[mode.icon as keyof typeof iconMap];
            const isSelected = selectedMode === mode.id;
            
            return (
              <Button
                key={mode.id}
                variant={isSelected ? `${mode.id}-mode` as any : "outline"}
                size="lg"
                onClick={() => onModeSelect(mode.id)}
                className={`h-auto p-4 flex flex-col items-center gap-3 ${isSelected ? 'ring-2 ring-white/20' : ''}`}
              >
                <IconComponent className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-semibold">{mode.name}</div>
                  <div className="text-xs opacity-90 mt-1">{mode.description}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export { chatModes };