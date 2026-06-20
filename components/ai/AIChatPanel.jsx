'use client';
// components/ai/AIChatPanel.jsx — Slide-up AI coaching chat panel (Groq / Llama 3)

import { useState, useEffect, useRef, useCallback } from 'react';
import { getSettings, getPRs, getWeightLog } from '@/lib/storage';
import { getCurrentPhase } from '@/lib/phases';
import { getMacroTargets } from '@/lib/macros';
import { getTodayDayKey, PPL_PROGRAM } from '@/lib/program';
import { buildSystemPrompt } from '@/lib/groqContext';
import { getTodayMealTotals } from '@/lib/storage';

const SUGGESTED = [
  "What should I eat today? 🍗",
  "Am I on track for my goals?",
  "How do I fix rounded shoulders?",
  "What's the best rest time for hypertrophy?",
];

export default function AIChatPanel({ onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hey! I'm GymCoach AI 💪 Ask me anything about your training, nutrition, form, or recovery. I know your full plan and current phase.",
      id: 'welcome',
    },
  ]);
  const [input,     setInput]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [streaming, setStreaming] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  const buildContext = useCallback(() => {
    const settings     = getSettings();
    const prs          = getPRs();
    const weightLog    = getWeightLog();
    const currentWeight = weightLog.length ? weightLog[weightLog.length - 1].weight : null;
    const phase        = getCurrentPhase(settings.startDate);
    const macroTargets = getMacroTargets(phase.phaseNum);
    const todayDayKey  = getTodayDayKey(settings.startDate);
    const today        = new Date().toISOString().split('T')[0];
    const todayMacros  = getTodayMealTotals(today);

    return buildSystemPrompt({
      settings, phase, prs, currentWeight,
      todayMacros, macroTargets, todayDayKey,
    });
  }, []);

  async function sendMessage(text) {
    const userText = text.trim();
    if (!userText || loading) return;

    const userMsg = { role: 'user', content: userText, id: Date.now().toString() };
    const historyForApi = messages.filter((m) => m.id !== 'welcome');

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const settings     = getSettings();
    const systemPrompt = buildContext();

    // Placeholder AI message for streaming
    const aiMsgId = Date.now().toString() + '-ai';
    setMessages((prev) => [...prev, { role: 'assistant', content: '', id: aiMsgId }]);

    try {
      const res = await fetch('/api/chat', {
        method:  'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(settings.groqApiKey && { 'x-groq-key': settings.groqApiKey }),
        },
        body: JSON.stringify({
          messages:     [...historyForApi, userMsg].map((m) => ({
            role:    m.role,
            content: m.content,
          })),
          systemPrompt,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      setLoading(false);
      setStreaming(true);

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data === '[DONE]') break;
            try {
              const parsed = JSON.parse(data);
              const token  = parsed.choices?.[0]?.delta?.content || '';
              if (token) {
                accumulated += token;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === aiMsgId ? { ...m, content: accumulated } : m
                  )
                );
              }
            } catch { /* skip bad JSON */ }
          }
        }
      }
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMsgId
            ? {
                ...m,
                content: getErrorMessage(err.message),
                isError: true,
              }
            : m
        )
      );
    } finally {
      setLoading(false);
      setStreaming(false);
    }
  }

  function getErrorMessage(msg) {
    if (msg.includes('401') || msg.includes('Invalid')) {
      return '⚠️ Invalid API key. Go to Settings and add your Groq API key (gsk_...).';
    }
    if (msg.includes('429')) {
      return '⏳ Rate limited. Please wait 30 seconds and try again.';
    }
    if (msg.includes('503') || msg.includes('fetch')) {
      return '📵 Can\'t reach AI right now. Check your internet connection.';
    }
    return `❌ Error: ${msg}. Please try again.`;
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.panel} role="dialog" aria-label="GymCoach AI Chat">

        {/* Drag handle */}
        <div style={styles.dragHandle} />

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.avatar}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C9.5 2 7.5 3.5 7 5.5C5.3 5.8 4 7.3 4 9C4 10.1 4.5 11.1 5.2 11.8C5.1 12.2 5 12.6 5 13C5 15.2 6.8 17 9 17H15C17.2 17 19 15.2 19 13C19 12.6 18.9 12.2 18.8 11.8C19.5 11.1 20 10.1 20 9C20 7.3 18.7 5.8 17 5.5C16.5 3.5 14.5 2 12 2Z" fill="rgba(168,85,247,0.3)" stroke="#C084FC" strokeWidth="1.5"/>
                <circle cx="9.5" cy="10" r="1" fill="#C084FC"/>
                <circle cx="14.5" cy="10" r="1" fill="#C084FC"/>
              </svg>
            </div>
            <div>
              <div style={styles.headerTitle}>GymCoach AI</div>
              <div style={styles.headerSub}>Llama 3 · Groq · Your Personal Coach</div>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close chat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div style={styles.messages} role="log" aria-live="polite">
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                ...styles.msgRow,
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div style={{
                ...styles.bubble,
                ...(msg.role === 'user' ? styles.userBubble : styles.aiBubble),
                ...(msg.isError ? styles.errorBubble : {}),
              }}>
                {msg.content || (
                  <div className="dots-loader">
                    <span/><span/><span/>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Suggested prompts (only at start) */}
          {messages.length === 1 && (
            <div style={styles.suggestions}>
              {SUGGESTED.map((s) => (
                <button
                  key={s}
                  style={styles.suggestionBtn}
                  onClick={() => sendMessage(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={styles.inputRow}>
          <input
            ref={inputRef}
            style={styles.input}
            type="text"
            placeholder="Ask your coach anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading || streaming}
            aria-label="Message to AI coach"
            enterKeyHint="send"
          />
          <button
            style={{
              ...styles.sendBtn,
              opacity: (!input.trim() || loading || streaming) ? 0.4 : 1,
            }}
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading || streaming}
            aria-label="Send message"
          >
            {loading ? (
              <div className="spinner" style={{ width: 18, height: 18 }} />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(5,5,8,0.7)',
    zIndex: 300,
    display: 'flex',
    alignItems: 'flex-end',
    animation: 'fadeIn 200ms ease-out',
  },
  panel: {
    width: '100%',
    maxWidth: 'var(--max-width)',
    margin: '0 auto',
    height: '75dvh',
    background: 'var(--surface)',
    border: '1px solid var(--border-2)',
    borderRadius: '20px 20px 0 0',
    display: 'flex',
    flexDirection: 'column',
    animation: 'slideUp 300ms cubic-bezier(0.16,1,0.3,1)',
    paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    overflow: 'hidden',
  },
  dragHandle: {
    width: '36px', height: '4px',
    background: 'var(--border-3)',
    borderRadius: '9999px',
    margin: '12px auto 0',
    flexShrink: 0,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px 12px',
    borderBottom: '1px solid var(--border)',
    flexShrink: 0,
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  avatar: {
    width: '36px', height: '36px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(168,85,247,0.2))',
    border: '1.5px solid rgba(168,85,247,0.4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: '16px', fontWeight: 700, color: 'var(--text-1)',
  },
  headerSub: { fontSize: '11px', color: 'var(--text-3)', marginTop: '1px' },
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  msgRow: { display: 'flex', gap: '8px' },
  bubble: {
    maxWidth: '82%',
    padding: '10px 14px',
    borderRadius: '16px',
    fontSize: '14px',
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    animation: 'typewriter 200ms ease-out',
  },
  userBubble: {
    background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
    color: '#fff',
    borderBottomRightRadius: '4px',
  },
  aiBubble: {
    background: 'var(--surface-2)',
    color: 'var(--text-1)',
    borderLeft: '2px solid rgba(168,85,247,0.4)',
    borderBottomLeftRadius: '4px',
  },
  errorBubble: {
    background: 'rgba(248,113,113,0.1)',
    borderLeft: '2px solid rgba(248,113,113,0.4)',
    color: 'var(--red)',
  },
  suggestions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '8px',
  },
  suggestionBtn: {
    textAlign: 'left',
    padding: '10px 14px',
    background: 'var(--surface-2)',
    border: '1px solid var(--border-2)',
    borderRadius: '12px',
    color: 'var(--text-2)',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 150ms ease-out',
    fontFamily: 'var(--font-body)',
  },
  inputRow: {
    display: 'flex',
    gap: '10px',
    padding: '12px 16px',
    borderTop: '1px solid var(--border)',
    flexShrink: 0,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: '44px',
    background: 'var(--surface-2)',
    border: '1.5px solid var(--border-2)',
    borderRadius: '12px',
    padding: '0 14px',
    color: 'var(--text-1)',
    fontSize: '15px',
    outline: 'none',
    fontFamily: 'var(--font-body)',
    transition: 'border-color 150ms',
  },
  sendBtn: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    background: 'var(--purple-dark)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    cursor: 'pointer',
    border: 'none',
    transition: 'opacity 150ms, transform 150ms',
    boxShadow: '0 2px 10px var(--purple-glow-strong)',
  },
};
