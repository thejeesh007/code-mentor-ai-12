import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft, 
  Send, 
  Brain, 
  User, 
  Lightbulb, 
  Code, 
  BookOpen,
  HelpCircle,
  Zap,
  Target
} from 'lucide-react';

interface AITutorChatProps {
  onBack: () => void;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'code' | 'hint' | 'explanation';
}

export const AITutorChat = ({ onBack }: AITutorChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your AI coding tutor. I'm here to help you with any programming questions, explain concepts, provide hints, or help debug your code. What would you like to learn about today?",
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickPrompts = [
    {
      icon: HelpCircle,
      text: "Explain Python lists",
      prompt: "Can you explain how Python lists work and give me some examples?"
    },
    {
      icon: Code,
      text: "Debug my code",
      prompt: "I have a bug in my code. Can you help me debug it?"
    },
    {
      icon: Lightbulb,
      text: "Give me a hint",
      prompt: "I'm stuck on this exercise. Can you give me a hint without the full solution?"
    },
    {
      icon: Target,
      text: "Practice exercises",
      prompt: "Can you give me a coding exercise to practice what I've learned?"
    }
  ];

  // Mock AI responses based on user input
  const generateAIResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();
    
    let response = "";
    let type: Message['type'] = 'text';

    if (lowerMessage.includes('list') || lowerMessage.includes('array')) {
      response = `Great question about lists! 📝

Lists in Python are ordered collections that can store multiple items. Here are the key concepts:

**Creating Lists:**
- Use square brackets: \`my_list = [1, 2, 3]\`
- Can store different types: \`mixed = ["hello", 42, True]\`

**Accessing Elements:**
- Use indexing: \`my_list[0]\` gets the first element
- Negative indexing: \`my_list[-1]\` gets the last element

**Common Operations:**
- Add items: \`my_list.append(4)\`
- Remove items: \`my_list.remove(2)\`
- Get length: \`len(my_list)\`

Would you like me to show you a specific example or explain any of these concepts in more detail?`;
      type = 'explanation';
    } else if (lowerMessage.includes('debug') || lowerMessage.includes('error') || lowerMessage.includes('bug')) {
      response = `I'd be happy to help debug your code! 🐛

To help you effectively, please share:

1. **Your code** - paste the code that's not working
2. **Error message** - if there's an error, what does it say?
3. **Expected vs Actual** - what should happen vs what's happening
4. **Context** - what are you trying to accomplish?

Common Python debugging tips:
- Check for indentation errors (Python is sensitive to spacing)
- Look for missing colons : after if/for/while statements  
- Verify variable names are spelled correctly
- Make sure you're using the right data types

Share your code and I'll help you find the issue! 💻`;
      type = 'explanation';
    } else if (lowerMessage.includes('hint') || lowerMessage.includes('stuck')) {
      response = `I understand you're looking for a hint! 💡

Instead of giving you the full solution, let me guide your thinking:

**General Problem-Solving Approach:**
1. **Break it down** - What smaller steps can you identify?
2. **What do you know?** - What concepts have you already learned that might apply?
3. **Start simple** - Can you solve a simpler version first?
4. **Trace through** - What should happen step by step?

If you share the specific exercise you're working on, I can give you a more targeted hint that will help you learn while still letting you figure it out yourself! 

What problem are you working on?`;
      type = 'hint';
    } else if (lowerMessage.includes('exercise') || lowerMessage.includes('practice')) {
      response = `Perfect! Practice is key to learning programming! 🎯

Here's a beginner-friendly exercise for you:

**List Manipulation Challenge:**

Create a program that:
1. Makes a list of your 5 favorite foods
2. Prints the first and last items
3. Adds a new food to the end
4. Removes the second item
5. Prints the final list and its length

**Concepts you'll practice:**
- List creation
- Indexing (positive and negative)
- append() method  
- remove() or pop() method
- len() function

Try it out and let me know how it goes! If you get stuck, I'm here to help. 🚀`;
      type = 'explanation';
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      response = `Hello! Great to see you're ready to learn! 👋

I'm here to help you master programming concepts. I can:

- **Explain concepts** clearly with examples
- **Help debug** your code when something's not working  
- **Provide hints** when you're stuck (without spoiling the solution)
- **Give practice exercises** to reinforce your learning
- **Answer questions** about programming in general

What would you like to start with today? Feel free to ask me anything about programming!`;
    } else {
      response = `That's a great question! 🤔

I want to make sure I give you the most helpful response. Could you be a bit more specific about what you'd like to know?

For example:
- Are you asking about a specific programming concept?
- Do you have code that's not working as expected?
- Are you looking for help with a particular exercise?
- Would you like me to explain something in a different way?

I'm here to help you learn effectively, so don't hesitate to ask follow-up questions! 📚`;
    }

    return {
      id: Date.now().toString(),
      content: response,
      sender: 'ai',
      timestamp: new Date(),
      type
    };
  };

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputMessage(prompt);
    inputRef.current?.focus();
  };

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground">
                <Brain className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">AI Tutor Chat</h1>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full animate-glow"></div>
                  <span className="text-sm text-muted-foreground">Online & Ready to Help</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 h-[calc(100vh-100px)]">
        <div className="grid lg:grid-cols-4 gap-6 h-full">
          {/* Quick Actions Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="learning-card">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto p-3"
                    onClick={() => handleQuickPrompt(prompt.prompt)}
                  >
                    <prompt.icon className="h-4 w-4 mr-3 flex-shrink-0" />
                    <span className="text-sm">{prompt.text}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card className="learning-card">
              <CardHeader>
                <CardTitle className="text-lg">AI Capabilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span>Concept Explanations</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Code className="h-4 w-4 text-secondary" />
                  <span>Code Debugging</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Lightbulb className="h-4 w-4 text-accent" />
                  <span>Hints & Guidance</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-success" />
                  <span>Practice Exercises</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3 flex flex-col h-full">
            <Card className="learning-card flex-1 flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Chat with AI Tutor</CardTitle>
                  <Badge variant="secondary" className="animate-glow">
                    <Brain className="h-3 w-3 mr-1" />
                    GPT-4 Powered
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages */}
                <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex items-start gap-3 animate-slide-up ${
                          message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                        }`}
                      >
                        <div className="flex-shrink-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            message.sender === 'user' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-gradient-primary text-primary-foreground'
                          }`}>
                            {message.sender === 'user' ? (
                              <User className="h-4 w-4" />
                            ) : (
                              <Brain className="h-4 w-4" />
                            )}
                          </div>
                        </div>
                        
                        <div className={`flex-1 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                          <div className={`inline-block max-w-[85%] p-3 rounded-2xl whitespace-pre-wrap ${
                            message.sender === 'user'
                              ? 'chat-message-user'
                              : 'chat-message-ai'
                          }`}>
                            {message.type === 'explanation' && (
                              <div className="flex items-center gap-2 mb-2 opacity-70">
                                <BookOpen className="h-3 w-3" />
                                <span className="text-xs font-medium">Explanation</span>
                              </div>
                            )}
                            {message.type === 'hint' && (
                              <div className="flex items-center gap-2 mb-2 opacity-70">
                                <Lightbulb className="h-3 w-3" />
                                <span className="text-xs font-medium">Hint</span>
                              </div>
                            )}
                            {message.content}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1 px-2">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Typing indicator */}
                    {isTyping && (
                      <div className="flex items-start gap-3 animate-fade-in">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-primary text-primary-foreground">
                            <Brain className="h-4 w-4" />
                          </div>
                        </div>
                        <div className="chat-message-ai">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                
                {/* Input Area */}
                <div className="border-t border-border p-4">
                  <div className="flex items-end gap-3">
                    <div className="flex-1">
                      <Input
                        ref={inputRef}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Ask me anything about programming..."
                        className="min-h-[44px] resize-none"
                        disabled={isTyping}
                      />
                    </div>
                    <Button
                      onClick={sendMessage}
                      disabled={!inputMessage.trim() || isTyping}
                      className="btn-hero px-4 py-2 h-[44px]"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="text-xs text-muted-foreground mt-2 text-center">
                    Press Enter to send, Shift+Enter for new line
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};