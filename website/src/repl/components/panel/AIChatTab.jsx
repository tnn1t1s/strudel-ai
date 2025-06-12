import { useState, useEffect, useRef } from 'react';
import { useSettings } from '@src/settings.mjs';
import { LangGraphAI } from '../../ai/LangGraphAI.js';

export function AIChatTab({ context }) {
  const { fontFamily } = useSettings();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const aiEngine = useRef(new LangGraphAI());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial welcome message
  useEffect(() => {
    const welcomeMessage = {
      id: Date.now(),
      type: 'ai',
      content: `🎵 Welcome to Strudel AI! 

I'm here to help you create music with natural language. Try asking me things like:
• "add a 909 kick pattern"
• "create a bassline like Peter Hook"
• "make the drums more syncopated"
• "add some ambient pads"

I can see your current patterns and will generate Strudel code for you!`,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages([welcomeMessage]);
  }, []);

  const getCurrentPatterns = () => {
    // Direct CodeMirror access - the working path
    const cmEditor = context.editorRef.current.editor;
    return cmEditor.state.doc.toString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Use real AI engine with current patterns context
      const currentPatterns = getCurrentPatterns();
      const aiResponse = await aiEngine.current.generateResponse(inputValue, { currentPatterns });
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse.text,
        code: aiResponse.code,
        explanation: aiResponse.explanation,
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: `Error: ${error.message}`,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };


  const injectCode = (code) => {
    // Use StrudelMirror's appendCode method - the working path
    const strudelEditor = context.editorRef.current;
    strudelEditor.appendCode('\n' + code);
  };

  return (
    <div className="px-4 flex flex-col w-full h-full text-foreground" style={{ fontFamily }}>
      {/* Header */}
      <div className="py-2">
        <h3 className="text-sm font-medium text-foreground">🤖 AI Assistant</h3>
      </div>

      {/* Messages */}
      <div className="min-h-0 max-h-full grow overflow-auto py-2 space-y-3">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg p-3 ${
              message.type === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-100'
            }`}>
              <div className="text-sm whitespace-pre-wrap">{message.content}</div>
              {message.code && (
                <div className="mt-2 p-2 bg-gray-900 rounded border">
                  <code className="text-xs text-green-400 block mb-2">{message.code}</code>
                  {message.explanation && (
                    <div className="text-xs text-gray-400 mb-2">{message.explanation}</div>
                  )}
                  <button
                    onClick={() => injectCode(message.code)}
                    className="px-2 py-1 text-xs bg-blue-500 hover:bg-blue-600 rounded"
                  >
                    Add to Editor
                  </button>
                </div>
              )}
              <div className="text-xs opacity-70 mt-1">{message.timestamp}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 text-gray-100 rounded-lg p-3">
              <div className="text-sm">Thinking...</div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="py-2">
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me to create patterns..."
            className="flex-1 px-3 py-2 text-sm bg-gray-800 border border-gray-600 rounded focus:outline-none focus:border-blue-500 text-white"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-white"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}