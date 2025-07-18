import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, Eye, EyeOff, ExternalLink } from "lucide-react";

interface ApiKeyInputProps {
  apiKey: string;
  onApiKeyChange: (apiKey: string) => void;
}

export function ApiKeyInput({ apiKey, onApiKeyChange }: ApiKeyInputProps) {
  const [showKey, setShowKey] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);

  const handleSave = () => {
    onApiKeyChange(tempKey);
  };

  const handleClear = () => {
    setTempKey("");
    onApiKeyChange("");
  };

  return (
    <Card className="bg-gradient-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Gemini API Key
        </CardTitle>
        <CardDescription>
          Enter your Google Gemini API key to start chatting. Your key is stored locally and never sent to our servers.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type={showKey ? "text" : "password"}
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              placeholder="AIzaSy..."
              className="pr-10 bg-secondary/50 border-border/50"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowKey(!showKey)}
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          <Button onClick={handleSave} disabled={!tempKey.trim()}>
            Save
          </Button>
          {apiKey && (
            <Button variant="outline" onClick={handleClear}>
              Clear
            </Button>
          )}
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p>Don't have an API key? Get one from Google AI Studio:</p>
          <Button variant="link" className="p-0 h-auto text-primary" asChild>
            <a 
              href="https://makersuite.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1"
            >
              Get API Key <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}