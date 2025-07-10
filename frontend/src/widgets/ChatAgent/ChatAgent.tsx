import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { MessageCircle, X, Maximize, Minimize, Send } from 'lucide-react';
import styles from './ChatAgent.module.css';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface IFormInput {
  message: string;
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
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<IFormInput>();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const onSubmit = async (data: IFormInput) => {
    const { message } = data;
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    reset();
    setIsTyping(true);

    try {
      const backendUrl = `${import.meta.env.VITE_BACKEND_IP}/agent/get_query`;
      const res = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: message }),
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await res.json();

      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responseData.response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, agentResponse]);
    } catch (error) {
      console.error("Failed to fetch agent's response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I am having trouble connecting. Please try again later.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const messageValue = watch('message');

  return (
    <>
      {/* Плавающая кнопка */}
      {!isOpen && (
        <button
          className={styles.chatFloatButton}
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle className={styles.chatIcon} />
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
                {isFullscreen ? <Minimize /> : <Maximize />}
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

          <form onSubmit={handleSubmit(onSubmit)} className={styles.chatInput}>
            <textarea
              {...register('message', { required: true })}
              onKeyDown={handleKeyPress}
              placeholder='Задайте вопрос о платформе...'
              rows={1}
              disabled={isSubmitting}
            />
            <button
              type='submit'
              disabled={!messageValue?.trim() || isSubmitting}
              className={styles.sendButton}
            >
              <Send />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
