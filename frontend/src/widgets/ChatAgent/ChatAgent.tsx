import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Maximize2, Minimize2, Send } from 'lucide-react';
import styles from './ChatAgent.module.css';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const ChatAgent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Добро пожаловать в DeFi Lending! Я ваш персональный помощник. Могу помочь вам разобраться с займами, инвестициями и ответить на любые вопросы о платформе.',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();

    if (
      message.includes('займ') ||
      message.includes('долг') ||
      message.includes('кредит')
    ) {
      return 'Для получения займа вам нужно: 1) Выбрать валюту обеспечения, 2) Указать валюту для получения, 3) Ввести сумму и срок, 4) Нажать "Получить котировки". Система покажет лучшие предложения от кредиторов.';
    }

    if (
      message.includes('инвест') ||
      message.includes('вложить') ||
      message.includes('доходность')
    ) {
      return 'В разделе "Вложить" вы можете инвестировать в различные валюты. Выберите валюту, сумму и срок. Система покажет ожидаемую доходность. Помните: высокая доходность связана с повышенным риском.';
    }

    if (message.includes('риск') || message.includes('безопасность')) {
      return 'Уровни риска: Низкий (стейблкоины), Средний (популярные токены), Высокий (волатильные активы). Всегда используйте только средства, потерю которых можете себе позволить.';
    }

    if (message.includes('кошелек') || message.includes('подключить')) {
      return 'Для работы с платформой подключите MetaMask или другой совместимый кошелек. Нажмите "Подключить кошелек" в правом верхнем углу.';
    }

    return 'Спасибо за ваш вопрос! Я помогу вам с займами, инвестициями и другими функциями платформы. Можете задать более конкретный вопрос?';
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Симуляция ответа агента
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: generateResponse(inputText),
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      {/* Плавающая кнопка */}
      {!isOpen && (
        <button
          className={styles.chatFloatButton}
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle />
        </button>
      )}

      {/* Чат окно */}
      {isOpen && (
        <div
          className={`${styles.chatWindow} ${isFullscreen ? styles.fullscreen : ''}`}
        >
          <div className={styles.chatHeader}>
            <div className={styles.chatTitle}>
              <MessageCircle className={styles.chatIcon} />
              <span>AI Помощник</span>
            </div>
            <div className={styles.chatControls}>
              <button
                className={styles.controlButton}
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? <Minimize2 /> : <Maximize2 />}
              </button>
              <button
                className={styles.controlButton}
                onClick={() => setIsOpen(false)}
              >
                <X />
              </button>
            </div>
          </div>

          <div className={styles.chatMessages}>
            {messages.map(message => (
              <div
                key={message.id}
                className={`${styles.message} ${message.isUser ? styles.user : styles.agent}`}
              >
                <div className={styles.messageContent}>
                  <p>{message.text}</p>
                  <span className={styles.messageTime}>
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className={`${styles.message} ${styles.agent}`}>
                <div className={styles.messageContent}>
                  <div className={styles.typingIndicator}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className={styles.chatInput}>
            <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder='Задайте вопрос о платформе...'
              rows={1}
            />
            <button
              onClick={sendMessage}
              disabled={!inputText.trim()}
              className={styles.sendButton}
            >
              <Send />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
