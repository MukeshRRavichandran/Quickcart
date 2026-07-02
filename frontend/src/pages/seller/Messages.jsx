import React, { useState } from 'react';
import { MessageSquare, Send, Paperclip, Search, Smile, User } from 'lucide-react';
import { useSeller } from '../../context/SellerContext';

export default function Messages() {
  const { messages, addMessage } = useSeller();

  const [activeThreadId, setActiveThreadId] = useState('CHAT-001');
  const [inputText, setInputText] = useState('');

  const activeChat = messages.find(m => m.id === activeThreadId) || messages[0];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Send user message
    addMessage(activeThreadId, inputText.trim());
    const txt = inputText.trim();
    setInputText('');

    // Trigger an automated customer response simulation!
    setTimeout(() => {
      // Simulate reply inside context
      addMessage(activeThreadId, `Understood! I will check the order details. Thanks for the quick response!`);
    }, 1500);
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div>
        <h1 className="font-outfit font-extrabold text-2xl text-neutral-800">Messages</h1>
        <p className="text-xs text-neutral-400 mt-0.5 font-semibold">Chat with clients, process order inquiries, and answer store questions.</p>
      </div>

      {/* Grid: Thread list and Chat view */}
      <div className="bg-white border border-neutral-100 rounded-3xl overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-3 min-h-[500px]">
        
        {/* Left Side: Threads List */}
        <div className="border-r border-neutral-100 flex flex-col">
          <div className="p-4 border-b border-neutral-50 relative">
            <input
              type="text"
              placeholder="Search chat..."
              className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-100 rounded-xl focus:bg-white focus:border-primary/20 outline-none text-xs text-neutral-700"
            />
            <Search size={14} className="absolute left-7 top-7 text-neutral-400" />
          </div>

          <div className="divide-y divide-neutral-50 flex-grow overflow-y-auto">
            {messages.map((m) => {
              const isActive = m.id === activeThreadId;
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveThreadId(m.id)}
                  className={`w-full p-4 text-left flex items-start gap-3 transition-colors ${
                    isActive ? 'bg-primary/5' : 'hover:bg-neutral-50/50'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-primary-light text-primary font-bold flex items-center justify-center text-sm flex-shrink-0">
                    {m.customer.charAt(0).toUpperCase()}
                  </div>
                  <div className="space-y-1 flex-grow text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-neutral-800">{m.customer}</span>
                      <span className="text-[9px] text-neutral-400 font-semibold">{m.time}</span>
                    </div>
                    <p className="text-neutral-500 line-clamp-1 font-medium">{m.lastMessage}</p>
                  </div>
                  {m.unreadCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Chat Window */}
        <div className="md:col-span-2 flex flex-col h-full justify-between">
          
          {/* Active Chat Header */}
          <div className="p-4 border-b border-neutral-50 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm">
              {activeChat.customer.charAt(0).toUpperCase()}
            </div>
            <div className="text-left space-y-0.5">
              <span className="font-bold text-neutral-800 text-sm">{activeChat.customer}</span>
              <span className="text-[10px] text-emerald-500 font-semibold block">Online</span>
            </div>
          </div>

          {/* Chat bubbles list */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4 max-h-[300px] sm:max-h-[380px] bg-neutral-50/30">
            {activeChat.thread.map((msg, idx) => {
              const isSeller = msg.sender === 'Seller';
              return (
                <div 
                  key={idx} 
                  className={`flex ${isSeller ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[75%] rounded-2xl p-3.5 text-xs sm:text-sm font-semibold leading-relaxed shadow-sm ${
                    isSeller 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-white border border-neutral-100 text-neutral-700 rounded-tl-none'
                  }`}>
                    <p>{msg.text}</p>
                    <span className={`text-[8px] block text-right mt-1.5 ${isSeller ? 'text-emerald-100' : 'text-neutral-400'}`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Form write input bar */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-neutral-100 flex items-center gap-3 bg-white">
            <button type="button" className="p-2 text-neutral-400 hover:text-neutral-600 rounded-xl hover:bg-neutral-50">
              <Paperclip size={18} />
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type message here..."
              className="flex-grow px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-primary/20 outline-none text-xs sm:text-sm text-neutral-700 transition-all font-semibold"
            />
            <button type="submit" className="p-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl shadow-md shadow-primary/10 transition-colors">
              <Send size={16} />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
