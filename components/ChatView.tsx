"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { queryChatbot, fetchChatHistory } from '@/services/api';

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'ai';
};

type ChatViewProps = {
  userId: string;
};

export default function ChatView({ userId }: ChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history based on session ID
  useEffect(() => {
    const loadChatHistory = async (id: number) => {
      try {
        const response = await fetchChatHistory(id);
        const fetchedMessages = response.chat_history.chat_history.map((msg: any, index: number) => ({
          id: index,
          text: msg.content,
          sender: msg.role === 'user' ? 'user' : 'ai',
        }));
        setMessages(fetchedMessages);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    if (sessionId) {
      loadChatHistory(sessionId);
    }
  }, [sessionId]);

  // Set session ID based on userId from URL
  useEffect(() => {
    if (userId) {
      const updatedUserId = parseInt(userId, 10) + 1000;
      setSessionId(updatedUserId);
    }
  }, [userId]);

  // Scroll to the bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() && sessionId) {
      const newMessage: Message = { id: Date.now(), text: input, sender: 'user' };
      setMessages((prev) => [...prev, newMessage]);
      setInput('');
      setIsTyping(true);

      try {
        const aiResponse = await queryChatbot(parseInt(userId), newMessage.text, sessionId);
        const aiMessage: Message = { id: Date.now(), text: aiResponse.answer, sender: 'ai' };
        setMessages((prev) => [...prev, aiMessage]);
        setIsTyping(false);
      } catch (error) {
        console.error('Error querying chatbot:', error);
        const errorMessage: Message = { id: Date.now(), text: 'Error fetching AI response', sender: 'ai' };
        setMessages((prev) => [...prev, errorMessage]);
        setIsTyping(false);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start space-x-2 max-w-3xl ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <Avatar className="w-8 h-8">
                  <AvatarImage src={message.sender === 'user' ? "/placeholder-user.jpg" : "/placeholder-ai.jpg"} />
                  <AvatarFallback>{message.sender === 'user' ? 'U' : 'AI'}</AvatarFallback>
                </Avatar>
                <div className={`rounded-lg p-3 ${message.sender === 'user' ? 'bg-blue-600' : 'bg-gray-700'}`}>
                  {message.text}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2 max-w-3xl">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/placeholder-ai.jpg" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div className="rounded-lg p-3 bg-gray-700">Typing...</div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="border-t border-gray-700 bg-gray-800 p-4">
          <div className="max-w-3xl mx-auto flex space-x-2">
            <Input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
            <Button onClick={handleSend} className="bg-blue-600">
              <Send />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
