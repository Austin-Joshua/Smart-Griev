import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useGrievances } from "@/contexts/GrievanceContext";
import { useNavigate } from "react-router-dom";
import {
    Bot,
    Send,
    User,
    Sparkles,
    FileText,
    ArrowRight,
    MessageCircle,
} from "lucide-react";

interface ChatMessage {
    id: number;
    role: "user" | "bot";
    content: string;
    timestamp: Date;
    action?: { type: "submit_grievance"; title: string; description: string };
}

const quickActions = [
    "I want to report a water supply issue",
    "There's a pothole on the road near my house",
    "Garbage hasn't been collected for days",
    "Street lights are not working",
    "I need help with a health-related complaint",
];

let msgId = 0;

function generateBotResponse(userMessage: string): { content: string; action?: ChatMessage["action"] } {
    const lower = userMessage.toLowerCase();

    // Check if user is describing a specific problem
    if (lower.includes("water") || lower.includes("supply") || lower.includes("pipeline")) {
        return {
            content: "I understand you're facing a **water supply issue**. I've categorized this under the **Water Authority** department with **high priority**.\n\nWould you like me to submit this grievance for you? I'll include all the details you've provided.",
            action: {
                type: "submit_grievance",
                title: "Water Supply Issue",
                description: userMessage,
            },
        };
    }

    if (lower.includes("pothole") || lower.includes("road") || lower.includes("traffic")) {
        return {
            content: "I can see this is a **road/traffic issue**. This will be routed to the **Transport Authority** with **high priority** since it affects public safety.\n\nShall I file this grievance on your behalf?",
            action: {
                type: "submit_grievance",
                title: "Road Infrastructure Issue",
                description: userMessage,
            },
        };
    }

    if (lower.includes("garbage") || lower.includes("waste") || lower.includes("sanitation") || lower.includes("clean")) {
        return {
            content: "This looks like a **sanitation concern**. I'll route this to **Municipal Services** with **medium priority**.\n\nWant me to submit this grievance right away?",
            action: {
                type: "submit_grievance",
                title: "Sanitation & Waste Management Issue",
                description: userMessage,
            },
        };
    }

    if (lower.includes("light") || lower.includes("electric") || lower.includes("power")) {
        return {
            content: "I've identified this as an **infrastructure/electricity issue**. This will be handled by the **Public Works** department.\n\nShould I go ahead and submit this grievance?",
            action: {
                type: "submit_grievance",
                title: "Electricity/Lighting Issue",
                description: userMessage,
            },
        };
    }

    if (lower.includes("health") || lower.includes("hospital") || lower.includes("medical") || lower.includes("doctor")) {
        return {
            content: "This is a **health-related concern** and will be marked as **high priority** for the **Health Department**.\n\nWould you like me to file this grievance immediately?",
            action: {
                type: "submit_grievance",
                title: "Health & Medical Services Complaint",
                description: userMessage,
            },
        };
    }

    if (lower.includes("track") || lower.includes("status") || lower.includes("check")) {
        return {
            content: "You can track all your submitted grievances on the **My Grievances** page. Each case has a unique ID and shows real-time status updates.\n\nWould you like me to take you to the dashboard?",
        };
    }

    if (lower.includes("yes") || lower.includes("submit") || lower.includes("file") || lower.includes("go ahead")) {
        return {
            content: "I'll submit that grievance for you right now! ✅\n\nYou can track its progress on the **Citizen Dashboard**. You'll receive notifications when the status changes.",
        };
    }

    if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
        return {
            content: "Hello! 👋 I'm your **SmartGriev AI Assistant**. I can help you:\n\n• **Submit a grievance** — Just describe your issue\n• **Track your cases** — Check the status of submissions\n• **Get help** — Navigate the platform\n\nWhat would you like help with today?",
        };
    }

    // Default response
    return {
        content: "I'd be happy to help! Could you please describe the specific issue you're facing? For example:\n\n• Water supply problems\n• Road damage or potholes\n• Garbage collection issues\n• Street light malfunctions\n• Health-related complaints\n\nThe more detail you provide, the better I can categorize and route your grievance.",
    };
}

export default function Chatbot() {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: msgId++,
            role: "bot",
            content: "Hello! 👋 I'm your **SmartGriev AI Assistant**. I can help you submit and track grievances using natural language.\n\nJust describe your issue and I'll automatically categorize it, assign priority, and route it to the right department.\n\nHow can I help you today?",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { addGrievance } = useGrievances();
    const navigate = useNavigate();

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (text?: string) => {
        const msg = text || input.trim();
        if (!msg) return;

        const userMsg: ChatMessage = {
            id: msgId++,
            role: "user",
            content: msg,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        // Simulate AI processing delay
        await new Promise((r) => setTimeout(r, 1000 + Math.random() * 1000));

        const response = generateBotResponse(msg);
        const botMsg: ChatMessage = {
            id: msgId++,
            role: "bot",
            content: response.content,
            timestamp: new Date(),
            action: response.action,
        };
        setMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);
        inputRef.current?.focus();
    };

    const handleAction = (action: ChatMessage["action"]) => {
        if (!action) return;

        if (action.type === "submit_grievance") {
            addGrievance({
                title: action.title,
                description: action.description,
            });

            const confirmMsg: ChatMessage = {
                id: msgId++,
                role: "bot",
                content: "✅ **Grievance submitted successfully!** Your case has been filed and assigned to the appropriate department.\n\nYou can view and track it on your dashboard.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, confirmMsg]);
        }
    };

    // Render markdown-like bold text
    const renderContent = (content: string) => {
        return content.split("\n").map((line, i) => {
            const parts = line.split(/(\*\*.*?\*\*)/g).map((part, j) => {
                if (part.startsWith("**") && part.endsWith("**")) {
                    return <strong key={j}>{part.slice(2, -2)}</strong>;
                }
                return part;
            });
            return (
                <span key={i}>
                    {parts}
                    {i < content.split("\n").length - 1 && <br />}
                </span>
            );
        });
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 container py-8">
                <div className="max-w-3xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="text-center space-y-3">
                        <div className="w-16 h-16 rounded-2xl hero-gradient flex items-center justify-center mx-auto shadow-soft">
                            <Bot className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <h1 className="font-heading text-2xl md:text-3xl font-bold">AI Grievance Assistant</h1>
                        <p className="text-muted-foreground">Describe your issue in plain language — I'll handle the rest</p>
                    </div>

                    {/* Chat Area */}
                    <Card className="shadow-card">
                        <CardContent className="p-0">
                            {/* Messages */}
                            <div className="h-[450px] overflow-y-auto p-6 space-y-4">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                                    >
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "bot"
                                                ? "hero-gradient text-primary-foreground"
                                                : "bg-muted text-muted-foreground"
                                                }`}
                                        >
                                            {msg.role === "bot" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                        </div>
                                        <div className={`max-w-[80%] space-y-2 ${msg.role === "user" ? "text-right" : ""}`}>
                                            <div
                                                className={`inline-block p-4 rounded-2xl text-sm leading-relaxed ${msg.role === "bot"
                                                    ? "bg-muted/50 text-foreground rounded-tl-none"
                                                    : "hero-gradient text-primary-foreground rounded-tr-none"
                                                    }`}
                                            >
                                                {renderContent(msg.content)}
                                            </div>

                                            {/* Action Buttons */}
                                            {msg.action && (
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="hero"
                                                        onClick={() => handleAction(msg.action)}
                                                    >
                                                        <FileText className="w-3 h-3" />
                                                        Submit Grievance
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => navigate("/dashboard")}
                                                    >
                                                        View Dashboard
                                                    </Button>
                                                </div>
                                            )}

                                            <p className="text-xs text-muted-foreground">
                                                {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                {isTyping && (
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full hero-gradient flex items-center justify-center shrink-0">
                                            <Bot className="w-4 h-4 text-primary-foreground" />
                                        </div>
                                        <div className="bg-muted/50 p-4 rounded-2xl rounded-tl-none">
                                            <div className="flex gap-1">
                                                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>

                            {/* Quick Actions */}
                            <div className="border-t px-6 py-3">
                                <div className="flex flex-wrap gap-2">
                                    {quickActions.map((action) => (
                                        <Badge
                                            key={action}
                                            variant="outline"
                                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-xs py-1"
                                            onClick={() => handleSend(action)}
                                        >
                                            <Sparkles className="w-3 h-3 mr-1" />
                                            {action}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Input */}
                            <div className="border-t p-4">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleSend();
                                    }}
                                    className="flex gap-3"
                                >
                                    <Input
                                        ref={inputRef}
                                        placeholder="Describe your issue or ask a question..."
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        className="flex-1"
                                        disabled={isTyping}
                                    />
                                    <Button type="submit" variant="hero" size="icon" disabled={isTyping || !input.trim()}>
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </form>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main >

            <Footer />
        </div >
    );
}
