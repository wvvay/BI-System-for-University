import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { BiSend, BiBot, BiUser, BiInfoCircle, BiHelpCircle } from 'react-icons/bi';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/AI/chat', 
        { message: userMessage },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setMessages(prev => [...prev, { role: 'assistant', content: response.data.answer }]);
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Извините, произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте позже.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedPrompts = [
    'Проанализируй мои данные',
    'Какие у меня слабые места в учебе?',
    'Как улучшить мою успеваемость?',
    'Какие предметы требуют большего внимания?',
    'Давай составим план обучения'
  ];

  const rules = [
    'Задавайте конкретные вопросы для получения точных ответов',
    'Используйте готовые промпты для быстрого анализа',
    'Можно запрашивать анализ по конкретным предметам',
    'Система может давать рекомендации по улучшению успеваемости',
    'Доступен анализ посещаемости и научной активности'
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-16rem)]">
      {/* Чат */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto mb-4 space-y-4 px-2"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                message.role === 'user'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-white text-gray-800'
              }`}
            >
              <div className="flex items-center mb-2">
                {message.role === 'assistant' ? (
                  <BiBot className="w-5 h-5 mr-2" />
                ) : (
                  <BiUser className="w-5 h-5 mr-2" />
                )}
                <span className="font-semibold">
                  {message.role === 'assistant' ? 'ИИ Ассистент' : 'Вы'}
                </span>
              </div>
              <div className="prose prose-sm max-w-none prose-headings:my-2 prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center mb-2">
                <BiBot className="w-5 h-5 mr-2" />
                <span className="font-semibold">ИИ Ассистент</span>
              </div>
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Подсказки и правила */}
      <div className="mb-4 space-y-4">
        {/* Подсказки */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <BiHelpCircle className="w-4 h-4 mr-1" />
            Попробуйте спросить:
          </h3>
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => setInput(prompt)}
                className="px-3 py-1 text-sm bg-white/50 hover:bg-white/80 text-gray-700 rounded-full transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Правила */}
        <div>
          <button
            onClick={() => setShowRules(!showRules)}
            className="text-sm font-medium text-gray-700 flex items-center hover:text-indigo-600 transition-colors"
          >
            <BiInfoCircle className="w-4 h-4 mr-1" />
            {showRules ? 'Скрыть правила' : 'Показать правила'}
          </button>
          {showRules && (
            <div className="mt-2 p-3 bg-white/50 rounded-lg">
              <ul className="text-sm text-gray-600 space-y-1">
                {rules.map((rule, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-indigo-500 mr-2">•</span>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Форма ввода */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Введите ваш вопрос..."
          className="flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-4 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <BiSend className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default AIChat; 