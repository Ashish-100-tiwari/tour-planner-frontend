'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface JourneyDetails {
    origin: string;
    destination: string;
}

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    map_image_url?: string;
    journey_details?: JourneyDetails;
}

interface MapData {
    map_image_url: string;
    journey_details: JourneyDetails;
}

export default function DashboardPage() {
    const router = useRouter();
    const [userName, setUserName] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentMapData, setCurrentMapData] = useState<MapData | null>(null);
    const [apiZoomLevel, setApiZoomLevel] = useState(12); // Google Maps zoom level (8-18)
    const [isLoadingMap, setIsLoadingMap] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Get user name from localStorage or session
        const storedUserName = localStorage.getItem('userName') || 'User';
        setUserName(storedUserName);

        // Load saved messages from localStorage
        const savedMessages = localStorage.getItem('chatMessages');
        if (savedMessages) {
            try {
                const parsed = JSON.parse(savedMessages);
                // Convert timestamp strings back to Date objects
                const messagesWithDates = parsed.map((msg: any) => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp)
                }));
                setMessages(messagesWithDates);

                // Find the most recent map data
                for (let i = messagesWithDates.length - 1; i >= 0; i--) {
                    if (messagesWithDates[i].map_image_url) {
                        setCurrentMapData({
                            map_image_url: messagesWithDates[i].map_image_url,
                            journey_details: messagesWithDates[i].journey_details!
                        });
                        break;
                    }
                }
            } catch (error) {
                console.error('Failed to load saved messages:', error);
            }
        }

        // Focus input on mount
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        // Scroll to bottom when messages change
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

        // Save messages to localStorage whenever they change
        if (messages.length > 0) {
            localStorage.setItem('chatMessages', JSON.stringify(messages));
        }
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

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

            console.log('Sending chat request:', {
                url: `${apiUrl}/v1/chat/completions`,
                token: token ? `${token.substring(0, 20)}...` : 'NO TOKEN',
                messagesCount: apiMessages.length
            });

            // Call the chat completions API
            const response = await fetch(`${apiUrl}/v1/chat/completions`, {
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
            const mapImageUrl = data.map_image_url;
            const journeyDetails = data.journey_details;

            const assistantMessage: Message = {
                id: data.id || (Date.now() + 1).toString(),
                role: 'assistant',
                content: assistantContent,
                timestamp: new Date(),
                map_image_url: mapImageUrl,
                journey_details: journeyDetails
            };

            setMessages(prev => [...prev, assistantMessage]);

            // Update current map data if new map is available
            if (mapImageUrl && journeyDetails) {
                setCurrentMapData({
                    map_image_url: mapImageUrl,
                    journey_details: journeyDetails
                });
            }
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

    const handleClearChat = () => {
        if (confirm('Are you sure you want to clear all chat history?')) {
            setMessages([]);
            setCurrentMapData(null);
            localStorage.removeItem('chatMessages');
        }
    };

    const handleSignOut = () => {
        localStorage.removeItem('userName');
        localStorage.removeItem('token');
        localStorage.removeItem('chatMessages');
        router.push('/');
    };

    // Fetch map with specific zoom level from API
    const fetchMapWithZoom = async (zoom: number) => {
        if (!currentMapData) return;

        setIsLoadingMap(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

            console.log('Fetching map with zoom:', {
                zoom,
                origin: currentMapData.journey_details.origin,
                destination: currentMapData.journey_details.destination,
                endpoint: `${apiUrl}/v1/map/generate`
            });

            const response = await fetch(`${apiUrl}/v1/map/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    origin: currentMapData.journey_details.origin,
                    destination: currentMapData.journey_details.destination,
                    zoom: zoom,
                    size: "600x400"
                })
            });

            console.log('Map API response status:', response.status);

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userName');
                    router.push('/auth/signin');
                    return;
                }

                // Get error details
                let errorDetail = '';
                try {
                    const errorData = await response.json();
                    errorDetail = errorData.detail || errorData.message || JSON.stringify(errorData);
                } catch {
                    errorDetail = await response.text();
                }

                console.error('Map API error:', {
                    status: response.status,
                    detail: errorDetail
                });

                throw new Error(`API returned ${response.status}: ${errorDetail}`);
            }

            const data = await response.json();
            console.log('Map API response data:', data);

            if (data.map_image_url) {
                setCurrentMapData({
                    map_image_url: data.map_image_url,
                    journey_details: currentMapData.journey_details
                });
                setApiZoomLevel(zoom);
            } else {
                throw new Error('No map_image_url in response');
            }
        } catch (error) {
            console.error('Error fetching map with zoom:', error);

            // Provide detailed error message
            let errorMessage = 'Failed to update map zoom.\n\n';

            if (error instanceof Error) {
                if (error.message.includes('404')) {
                    errorMessage += 'The backend endpoint /v1/map/generate is not available yet.\n\n';
                    errorMessage += 'Please ensure the backend has been updated with the map zoom endpoint.';
                } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                    errorMessage += 'Cannot connect to the backend server.\n\n';
                    errorMessage += 'Please check if the backend is running.';
                } else {
                    errorMessage += `Error: ${error.message}`;
                }
            }

            alert(errorMessage);
        } finally {
            setIsLoadingMap(false);
        }
    };

    const handleZoomIn = () => {
        const newZoom = Math.min(apiZoomLevel + 1, 18);
        if (newZoom !== apiZoomLevel) {
            fetchMapWithZoom(newZoom);
        }
    };

    const handleZoomOut = () => {
        const newZoom = Math.max(apiZoomLevel - 1, 8);
        if (newZoom !== apiZoomLevel) {
            fetchMapWithZoom(newZoom);
        }
    };

    const handleZoomReset = () => {
        if (apiZoomLevel !== 12) {
            fetchMapWithZoom(12);
        }
    };

    // Reset zoom when map changes
    useEffect(() => {
        setApiZoomLevel(12);
    }, [currentMapData?.journey_details.origin, currentMapData?.journey_details.destination]);

    // Keyboard shortcuts for zoom
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            // Only handle if not typing in an input/textarea
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            if (e.key === '+' || e.key === '=') {
                e.preventDefault();
                handleZoomIn();
            } else if (e.key === '-' || e.key === '_') {
                e.preventDefault();
                handleZoomOut();
            } else if (e.key === '0') {
                e.preventDefault();
                handleZoomReset();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [apiZoomLevel, currentMapData]);

    // Mouse wheel scroll zoom
    useEffect(() => {
        const mapContainer = mapContainerRef.current;
        if (!mapContainer || !currentMapData) return;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();

            // Determine zoom direction based on wheel delta
            if (e.deltaY < 0) {
                // Scroll up = zoom in
                handleZoomIn();
            } else if (e.deltaY > 0) {
                // Scroll down = zoom out
                handleZoomOut();
            }
        };

        mapContainer.addEventListener('wheel', handleWheel, { passive: false });
        return () => mapContainer.removeEventListener('wheel', handleWheel);
    }, [apiZoomLevel, currentMapData]);

    return (
        <div className="h-screen bg-white dark:bg-black flex flex-col overflow-hidden">
            {/* Header */}
            <header className="flex-shrink-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-full mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-semibold text-black dark:text-white">
                        Tour Planner AI
                    </h1>
                    <div className="flex items-center gap-3">
                        {messages.length > 0 && (
                            <button
                                onClick={handleClearChat}
                                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                            >
                                Clear Chat
                            </button>
                        )}
                        <button
                            onClick={handleSignOut}
                            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </header>

            {/* Two-Column Layout */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                {/* Left Column - Chat */}
                <div className="flex flex-col w-full lg:w-1/2 border-r border-gray-200 dark:border-gray-800 overflow-hidden">
                    {/* Chat Area */}
                    <main className="flex-1 overflow-y-auto">
                        <div className="max-w-3xl mx-auto px-6 py-8">
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
                                                className={`max-w-[85%] rounded-2xl px-6 py-4 ${message.role === 'user'
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
                    <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-6">
                        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
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

                {/* Right Column - Map Explorer */}
                <div className="flex flex-col w-full lg:w-1/2 bg-gray-50 dark:bg-gray-950 overflow-hidden">
                    {currentMapData ? (
                        // Map with data
                        <div className="flex-1 flex flex-col p-6 overflow-hidden">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-semibold text-black dark:text-white mb-2">
                                        Route Map
                                    </h2>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                                            📍 {currentMapData.journey_details.origin}
                                        </span>
                                        <span className="text-gray-400">→</span>
                                        <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full">
                                            📍 {currentMapData.journey_details.destination}
                                        </span>
                                    </div>
                                </div>

                                {/* Zoom Controls */}
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">
                                        Zoom: {apiZoomLevel}
                                    </span>
                                    <button
                                        onClick={handleZoomOut}
                                        disabled={apiZoomLevel <= 8 || isLoadingMap}
                                        className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                        title="Zoom Out (- key)"
                                    >
                                        <svg className="w-5 h-5 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={handleZoomReset}
                                        disabled={apiZoomLevel === 12 || isLoadingMap}
                                        className="px-3 py-2 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-black dark:text-white font-medium"
                                        title="Reset Zoom (0 key)"
                                    >
                                        Reset
                                    </button>
                                    <button
                                        onClick={handleZoomIn}
                                        disabled={apiZoomLevel >= 18 || isLoadingMap}
                                        className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                        title="Zoom In (+ key)"
                                    >
                                        <svg className="w-5 h-5 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div
                                ref={mapContainerRef}
                                className="flex-1 bg-white dark:bg-black rounded-2xl shadow-xl overflow-hidden relative"
                            >
                                {/* Loading Overlay */}
                                {isLoadingMap && (
                                    <div className="absolute inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-10">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 border-t-black dark:border-t-white rounded-full animate-spin"></div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Updating map...</p>
                                        </div>
                                    </div>
                                )}

                                <div className="w-full h-full flex items-center justify-center overflow-auto">
                                    <img
                                        src={currentMapData.map_image_url}
                                        alt={`Route from ${currentMapData.journey_details.origin} to ${currentMapData.journey_details.destination}`}
                                        className="w-full h-full object-contain transition-opacity duration-300"
                                        style={{
                                            opacity: isLoadingMap ? 0.5 : 1
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Map Explorer Placeholder
                        <div className="flex-1 flex items-center justify-center p-6">
                            <div className="text-center max-w-md">
                                <div className="mb-8 relative">
                                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-6 transition-transform">
                                        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                        </svg>
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full animate-ping"></div>
                                    <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-green-400 rounded-full animate-pulse"></div>
                                </div>
                                <h2 className="text-3xl font-bold text-black dark:text-white mb-4">
                                    Map Explorer
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    Ask about routes and destinations to see interactive maps appear here
                                </p>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-500">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <span>Real-time route visualization</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-500">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                        <span>Interactive journey details</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-500">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span>Powered by Google Maps</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
