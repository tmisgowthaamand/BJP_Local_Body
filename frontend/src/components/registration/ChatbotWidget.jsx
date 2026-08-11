import React, { useState, useRef, useEffect } from 'react';
import { useApplication } from '../../context/ApplicationContext';
import { useChatbot } from '../../hooks/useChatbot';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const { state } = useApplication();
  const { messages, sendMessage, loading } = useChatbot(state.step);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;
    sendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <button
        type="button"
        className="chatbot-fab"
        onClick={() => setIsOpen(!isOpen)}
        title="Candidate Application Support Chat"
        aria-label="Open Chatbot"
      >
        {isOpen ? (
          <span style={{ fontSize: '24px', fontWeight: 800 }}>✕</span>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div
            style={{
              backgroundColor: '#1B5E20',
              color: '#FFFFFF',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '2px solid #FF6600'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '28px', height: '28px' }}>
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                  <path d="M50 15C50 15 35 32 35 50C35 62 43 70 50 72C57 70 65 62 65 50C65 32 50 15 50 15Z" fill="#FF6600" />
                  <path d="M50 15C50 15 20 38 20 58C20 70 32 78 45 76C40 68 40 54 50 15Z" fill="#FF8C00" />
                  <path d="M50 15C50 15 80 38 80 58C80 70 68 78 55 76C60 68 60 54 50 15Z" fill="#FF8C00" />
                </svg>
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '15px' }}>Candidate Support</div>
                <div style={{ fontSize: '11px', opacity: 0.85 }}>Ask me anything about your application</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: '#FFFFFF', fontSize: '18px', cursor: 'pointer', opacity: 0.8 }}
            >
              ✕
            </button>
          </div>

          {/* Messages List */}
          <div
            style={{
              flex: 1,
              backgroundColor: '#FFF8F0',
              padding: '16px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            {messages.map((msg, idx) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={idx}
                  style={{
                    alignSelf: isUser ? 'flex-end' : 'flex-start',
                    maxWidth: '82%',
                    backgroundColor: isUser ? '#FF6600' : '#FFFFFF',
                    color: isUser ? '#FFFFFF' : '#1A1A1A',
                    borderRadius: isUser ? '14px 14px 0 14px' : '14px 14px 14px 0',
                    padding: '10px 14px',
                    fontSize: '13px',
                    lineHeight: '1.4',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                    border: isUser ? 'none' : '1.5px solid #E8F5E9'
                  }}
                >
                  {msg.content}
                </div>
              );
            })}
            {loading && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: '#FFFFFF',
                  color: '#888888',
                  borderRadius: '14px 14px 14px 0',
                  padding: '10px 14px',
                  fontSize: '13px',
                  fontStyle: 'italic',
                  border: '1.5px solid #E8F5E9'
                }}
              >
                Thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSend}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 12px',
              borderTop: '2px solid #FF6600',
              backgroundColor: '#FFFFFF'
            }}
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask a question..."
              style={{
                flex: 1,
                height: '38px',
                padding: '0 12px',
                borderRadius: '20px',
                border: '1px solid #E0E0E0',
                fontSize: '13px',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || loading}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: !inputText.trim() || loading ? '#CCCCCC' : '#FF6600',
                color: '#FFFFFF',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: !inputText.trim() || loading ? 'not-allowed' : 'pointer'
              }}
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
