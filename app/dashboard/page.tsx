'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export default function DashboardPage() {
    const router = useRouter();
    const [userName, setUserName] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        // Get user name from localStorage or session
        const storedUserName = localStorage.getItem('userName') || 'User';
        setUserName(storedUserName);

        // Focus input on mount
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        // Scroll to bottom when messages change
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            // Get access token from localStorage
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('No authentication token found');
            }

            // Build messages array for API (include conversation history)
            const apiMessages = [...messages, userMessage].map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            console.log('Sending chat request:', {
                url: 'http://localhost:8000/v1/chat/completions',
                token: token ? `${token.substring(0, 20)}...` : 'NO TOKEN',
                messagesCount: apiMessages.length
            });

            // Call the chat completions API
            const response = await fetch('http://localhost:8000/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    messages: apiMessages,
                    temperature: 0.7,
                    max_tokens: 512
                })
            });

            if (!response.ok) {
                // Try to get error details from response
                let errorDetail = '';
                try {
                    const errorData = await response.json();
                    errorDetail = errorData.detail || errorData.message || JSON.stringify(errorData);
                } catch {
                    errorDetail = await response.text();
                }

                console.error('API Error Response:', errorDetail);

                if (response.status === 401) {
                    // Token expired or invalid, redirect to signin
                    localStorage.removeItem('token');
                    localStorage.removeItem('userName');
                    router.push('/auth/signin');
                    return;
                }
                throw new Error(`API error ${response.status}: ${errorDetail}`);
            }

            const data = await response.json();

            // Extract assistant message from response
            const assistantContent = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

            const assistantMessage: Message = {
                id: data.id || (Date.now() + 1).toString(),
                role: 'assistant',
                content: assistantContent,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Chat error:', error);

            // Show error message to user with more details
            let errorContent = 'Sorry, I encountered an error. ';

            if (error instanceof Error) {
                errorContent += `Error: ${error.message}`;
            } else {
                errorContent += 'Please try again or check if the server is running.';
            }

            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: errorContent,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleSignOut = () => {
        localStorage.removeItem('userName');
        localStorage.removeItem('token');
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-semibold text-black dark:text-white">
                        Tour Planner AI
                    </h1>
                    <button
                        onClick={handleSignOut}
                        className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </header>

            {/* Main Chat Area */}
            <main className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto px-6 py-8">
                    {messages.length === 0 ? (
                        // Welcome Screen
                        <div className="flex flex-col items-center justify-center min-h-[60vh]">
                            <div className="text-center mb-12">
                                <h2 className="text-4xl md:text-5xl font-semibold text-black dark:text-white mb-4">
                                    Hi {userName}! 👋
                                </h2>
                                <p className="text-xl text-gray-600 dark:text-gray-400">
                                    How can I help you plan your trip today?
                                </p>
                            </div>

                            {/* Suggestion Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                                <button
                                    onClick={() => setInputValue('Plan a weekend trip to Paris')}
                                    className="p-6 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-gray-300 dark:hover:border-gray-700 transition-all text-left group"
                                >
                                    <div className="text-2xl mb-3">✈️</div>
                                    <h3 className="font-medium text-black dark:text-white mb-2 group-hover:underline">
                                        Plan a weekend trip
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Get flight, hotel, and activity recommendations
                                    </p>
                                </button>

                                <button
                                    onClick={() => setInputValue('Find trains from New York to Boston')}
                                    className="p-6 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-gray-300 dark:hover:border-gray-700 transition-all text-left group"
                                >
                                    <div className="text-2xl mb-3">🚂</div>
                                    <h3 className="font-medium text-black dark:text-white mb-2 group-hover:underline">
                                        Find transportation
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Search trains, flights, and buses
                                    </p>
                                </button>

                                <button
                                    onClick={() => setInputValue('Recommend hotels in Tokyo under $150/night')}
                                    className="p-6 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-gray-300 dark:hover:border-gray-700 transition-all text-left group"
                                >
                                    <div className="text-2xl mb-3">🏨</div>
                                    <h3 className="font-medium text-black dark:text-white mb-2 group-hover:underline">
                                        Find accommodations
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Discover hotels matching your budget
                                    </p>
                                </button>

                                <button
                                    onClick={() => setInputValue('What are the best restaurants in Rome?')}
                                    className="p-6 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-gray-300 dark:hover:border-gray-700 transition-all text-left group"
                                >
                                    <div className="text-2xl mb-3">🍽️</div>
                                    <h3 className="font-medium text-black dark:text-white mb-2 group-hover:underline">
                                        Discover food & activities
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Get top-rated recommendations
                                    </p>
                                </button>
                            </div>
                        </div>
                    ) : (
                        // Messages
                        <div className="space-y-6 pb-32">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-6 py-4 ${message.role === 'user'
                                            ? 'bg-black dark:bg-white text-white dark:text-black'
                                            : 'bg-gray-100 dark:bg-gray-900 text-black dark:text-white border border-gray-200 dark:border-gray-800'
                                            }`}
                                    >
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                            {message.content}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl px-6 py-4">
                                        <div className="flex space-x-2">
                                            <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>
            </main>

            {/* Input Area */}
            <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent dark:from-black dark:via-black dark:to-transparent pt-8 pb-6">
                <div className="max-w-4xl mx-auto px-6">
                    <form onSubmit={handleSubmit} className="relative">
                        <div className="relative bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg hover:border-gray-300 dark:hover:border-gray-700 transition-all focus-within:border-black dark:focus-within:border-white">
                            <textarea
                                ref={inputRef}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Message Tour Planner AI..."
                                rows={1}
                                className="w-full px-6 py-4 pr-14 bg-transparent text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-600 resize-none outline-none text-base"
                                style={{
                                    minHeight: '56px',
                                    maxHeight: '200px',
                                }}
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim() || isLoading}
                                className="absolute right-3 bottom-3 p-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                                    />
                                </svg>
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-600 text-center mt-3">
                            Press Enter to send, Shift + Enter for new line
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
