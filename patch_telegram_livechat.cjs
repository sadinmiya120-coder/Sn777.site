const fs = require("fs");
const path = require("path");

const tgWidgetHTML = `
<!-- Sn777 Official Telegram Live Chat Widget -->
<style id="sn777-telegram-chat-styles">
  .sn-side-dock {
    position: fixed;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    z-index: 99999;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 9px;
    user-select: none;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }
  @media (min-width: 768px) {
    .sn-side-dock {
      right: 16px;
      gap: 10px;
    }
  }
  .sn-tg-float-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    user-select: none;
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.2s ease;
    gap: 0;
  }
  .sn-tg-float-btn:hover {
    transform: scale(1.08);
    filter: brightness(1.06);
  }
  .sn-tg-float-btn:active {
    transform: scale(0.95);
  }
  .sn-side-social-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  .sn-side-social-btn {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
    text-decoration: none;
    border: 2px solid rgba(255, 255, 255, 0.9);
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
  }
  @media (min-width: 768px) {
    .sn-side-social-btn {
      width: 48px;
      height: 48px;
    }
  }
  .sn-side-social-btn:hover {
    transform: scale(1.15) translateX(-2px);
    border-color: #ffffff;
  }
  .sn-side-social-btn:active {
    transform: scale(0.92);
  }
  .sn-side-social-tg {
    background: linear-gradient(135deg, #0088cc 0%, #24a1de 100%);
    box-shadow: 0 4px 14px rgba(0, 136, 204, 0.5);
  }
  .sn-side-social-tg:hover {
    box-shadow: 0 6px 22px rgba(0, 136, 204, 0.85);
  }
  .sn-side-social-wa {
    background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
    box-shadow: 0 4px 14px rgba(37, 211, 102, 0.5);
  }
  .sn-side-social-wa:hover {
    box-shadow: 0 6px 22px rgba(37, 211, 102, 0.85);
  }
  .sn-side-social-fb {
    background: linear-gradient(135deg, #1877F2 0%, #0d65d9 100%);
    box-shadow: 0 4px 14px rgba(24, 119, 242, 0.5);
  }
  .sn-side-social-fb:hover {
    box-shadow: 0 6px 22px rgba(24, 119, 242, 0.85);
  }
  .sn-side-tooltip {
    position: absolute;
    right: 56px;
    top: 50%;
    transform: translateY(-50%) translateX(10px);
    background: rgba(15, 23, 42, 0.95);
    color: #ffffff;
    font-size: 11.5px;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 8px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: all 0.2s ease;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.5);
  }
  .sn-side-social-btn:hover .sn-side-tooltip {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }
  .sn-tg-circle {
    width: 62px;
    height: 62px;
    border-radius: 50%;
    background: linear-gradient(135deg, #0b1329 0%, #1e293b 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 25px rgba(0, 136, 204, 0.55), 0 0 15px rgba(251, 191, 36, 0.45), inset 0 2px 4px rgba(255, 255, 255, 0.4);
    border: 2px solid #fbbf24;
    position: relative;
    animation: snTgPulse 2.2s infinite;
    overflow: hidden;
  }
  .sn-tg-logo-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
    display: block;
    pointer-events: none;
  }
  @keyframes snTgPulse {
    0% { box-shadow: 0 0 0 0 rgba(0, 136, 204, 0.75), 0 8px 25px rgba(0, 136, 204, 0.55); }
    70% { box-shadow: 0 0 0 14px rgba(0, 136, 204, 0), 0 8px 25px rgba(0, 136, 204, 0.55); }
    100% { box-shadow: 0 0 0 0 rgba(0, 136, 204, 0), 0 8px 25px rgba(0, 136, 204, 0.55); }
  }
  .sn-tg-online-dot {
    position: absolute;
    top: 2px;
    right: 2px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #10b981;
    border: 2.5px solid #ffffff;
    box-shadow: 0 0 10px #10b981;
  }
  .sn-tg-unread-badge {
    position: absolute;
    top: -4px;
    left: -4px;
    background: #ef4444;
    color: #ffffff;
    font-size: 11px;
    font-weight: 900;
    min-width: 20px;
    height: 20px;
    border-radius: 10px;
    display: none;
    align-items: center;
    justify-content: center;
    border: 2px solid #ffffff;
    box-shadow: 0 2px 6px rgba(239, 68, 68, 0.5);
    padding: 0 4px;
  }
  .sn-tg-pill-label {
    background: linear-gradient(135deg, #0088cc 0%, #24a1de 100%);
    color: #ffffff;
    font-size: 9.5px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 10px;
    margin-top: -8px;
    z-index: 2;
    border: 1px solid rgba(255, 255, 255, 0.9);
    box-shadow: 0 3px 8px rgba(0, 136, 204, 0.4);
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 3.5px;
    letter-spacing: 0.1px;
    line-height: 1.2;
  }
  .sn-tg-pill-dot {
    width: 4.5px;
    height: 4.5px;
    border-radius: 50%;
    background: #4ade80;
    animation: snBlink 1.5s infinite;
  }
  @keyframes snBlink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  /* Chat Window Styling */
  .sn-tg-chat-window {
    position: fixed;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
    width: 380px;
    height: 600px;
    max-height: calc(100vh - 40px);
    background: #0e1621;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), 0 0 1px 1px rgba(0, 136, 204, 0.2);
    display: none;
    flex-direction: column;
    overflow: hidden;
    z-index: 100000;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    animation: snModalPop 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }
  @media (max-width: 640px) {
    .sn-tg-chat-window {
      bottom: 0 !important;
      right: 0 !important;
      top: 0 !important;
      left: 0 !important;
      transform: none !important;
      width: 100% !important;
      height: 100% !important;
      height: 100dvh !important;
      max-height: 100dvh !important;
      border-radius: 0 !important;
      border: none !important;
    }
  }
  @keyframes snModalPop {
    from { opacity: 0; transform: translateY(-50%) scale(0.92); }
    to { opacity: 1; transform: translateY(-50%) scale(1); }
  }
  @media (max-width: 640px) {
    @keyframes snModalPop {
      from { opacity: 0; transform: scale(0.96); }
      to { opacity: 1; transform: scale(1); }
    }
  }

  /* Chat Header */
  .sn-tg-header {
    background: linear-gradient(135deg, #17212b 0%, #0e1621 100%);
    padding: 12px 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #242f3d;
    box-shadow: 0 2px 8px rgba(0,0,0,0.25);
  }
  .sn-tg-header-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .sn-tg-avatar-box {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: linear-gradient(135deg, #0088cc, #24a1de);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border: 1.5px solid rgba(255, 255, 255, 0.4);
    box-shadow: 0 2px 10px rgba(0, 136, 204, 0.3);
  }
  .sn-tg-info-title {
    color: #ffffff;
    font-size: 15px;
    font-weight: 700;
    line-height: 1.2;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .sn-tg-verified-icon {
    color: #24a1de;
    display: inline-flex;
  }
  .sn-tg-info-sub {
    color: #4ade80;
    font-size: 11px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 2px;
  }
  .sn-tg-header-actions {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .sn-tg-open-app-btn {
    background: rgba(0, 136, 204, 0.15);
    border: 1px solid rgba(0, 136, 204, 0.4);
    color: #24a1de;
    padding: 5px 10px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
  }
  .sn-tg-open-app-btn:hover {
    background: #0088cc;
    color: #ffffff;
  }
  .sn-tg-close-btn {
    background: rgba(255, 255, 255, 0.08);
    border: none;
    color: #9ca3af;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.2s;
  }
  .sn-tg-close-btn:hover {
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
  }

  /* User Info Status Strip */
  .sn-tg-user-bar {
    background: #17212b;
    padding: 6px 14px;
    font-size: 11px;
    color: #8da4be;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  .sn-tg-user-bar span b {
    color: #ffffff;
  }

  /* Chat Messages Body */
  .sn-tg-body {
    flex: 1;
    overflow-y: auto;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    background-color: #0e1621;
    background-image: radial-gradient(rgba(36, 161, 222, 0.04) 1px, transparent 1px);
    background-size: 16px 16px;
    scroll-behavior: smooth;
  }
  .sn-tg-body::-webkit-scrollbar {
    width: 4px;
  }
  .sn-tg-body::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 4px;
  }

  /* Date badge */
  .sn-tg-date-badge {
    align-self: center;
    background: rgba(0, 0, 0, 0.35);
    color: #8da4be;
    font-size: 10px;
    font-weight: 700;
    padding: 3px 12px;
    border-radius: 10px;
    letter-spacing: 0.5px;
    margin: 4px 0;
  }

  /* Message bubbles */
  .sn-tg-bubble-wrap {
    display: flex;
    flex-direction: column;
    max-width: 82%;
  }
  .sn-tg-bubble-wrap.admin {
    align-self: flex-start;
  }
  .sn-tg-bubble-wrap.user {
    align-self: flex-end;
  }

  .sn-tg-bubble {
    padding: 10px 14px;
    border-radius: 16px;
    font-size: 13.5px;
    line-height: 1.45;
    position: relative;
    word-break: break-word;
    box-shadow: 0 1px 3px rgba(0,0,0,0.25);
  }
  .sn-tg-bubble-wrap.admin .sn-tg-bubble {
    background: #182533;
    color: #f1f5f9;
    border-bottom-left-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.06);
  }
  .sn-tg-bubble-wrap.user .sn-tg-bubble {
    background: linear-gradient(135deg, #2b5278 0%, #1e3c5d 100%);
    color: #ffffff;
    border-bottom-right-radius: 4px;
    border: 1px solid rgba(36, 161, 222, 0.3);
  }

  .sn-tg-bubble img {
    max-width: 100%;
    border-radius: 10px;
    margin-top: 4px;
    display: block;
    cursor: pointer;
  }

  .sn-tg-bubble-meta {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 4px;
    font-size: 10px;
    color: rgba(255, 255, 255, 0.6);
    margin-top: 4px;
  }
  .sn-tg-check {
    color: #4ade80;
    font-size: 11px;
  }

  /* Quick Suggestion Chips */
  .sn-tg-quick-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 6px;
  }
  .sn-tg-chip {
    background: rgba(36, 161, 222, 0.12);
    border: 1px solid rgba(36, 161, 222, 0.35);
    color: #64b5f6;
    font-size: 11.5px;
    font-weight: 600;
    padding: 6px 12px;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.2s;
    user-select: none;
  }
  .sn-tg-chip:hover {
    background: #24a1de;
    color: #ffffff;
    border-color: #24a1de;
  }

  /* Typing indicator */
  .sn-tg-typing {
    display: none;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: #8da4be;
    align-self: flex-start;
    padding: 4px 8px;
  }
  .sn-tg-typing-dots {
    display: flex;
    gap: 3px;
  }
  .sn-tg-typing-dots span {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #24a1de;
    animation: snDotBounce 1.2s infinite ease-in-out;
  }
  .sn-tg-typing-dots span:nth-child(2) { animation-delay: 0.2s; }
  .sn-tg-typing-dots span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes snDotBounce {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
    40% { transform: translateY(-4px); opacity: 1; }
  }

  /* Chat Input Footer */
  .sn-tg-footer {
    background: #17212b;
    padding: 10px 12px;
    border-top: 1px solid #242f3d;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .sn-tg-input-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .sn-tg-attach-btn {
    background: transparent;
    border: none;
    color: #8da4be;
    cursor: pointer;
    padding: 6px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }
  .sn-tg-attach-btn:hover {
    color: #24a1de;
    background: rgba(36, 161, 222, 0.1);
  }
  .sn-tg-input {
    flex: 1;
    background: #0e1621;
    border: 1px solid #242f3d;
    border-radius: 20px;
    padding: 9px 14px;
    color: #ffffff;
    font-size: 13.5px;
    outline: none;
    transition: border-color 0.2s;
  }
  .sn-tg-input:focus {
    border-color: #24a1de;
  }
  .sn-tg-input::placeholder {
    color: #64748b;
  }
  .sn-tg-send-btn {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: linear-gradient(135deg, #0088cc, #24a1de);
    border: none;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 136, 204, 0.4);
    transition: transform 0.15s;
    flex-shrink: 0;
  }
  .sn-tg-send-btn:hover {
    transform: scale(1.05);
  }
  .sn-tg-send-btn:active {
    transform: scale(0.92);
  }

  .sn-tg-bottom-note {
    font-size: 10.5px;
    color: #64748b;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }
  .sn-tg-bottom-note a {
    color: #24a1de;
    text-decoration: underline;
    font-weight: 700;
  }
</style>

<!-- Side Contact Dock (Live Chat + Telegram + WhatsApp + Facebook) -->
<div class="sn-side-dock">
  <!-- Live Chat Trigger -->
  <div id="snTgFloatBtn" class="sn-tg-float-btn" onclick="toggleSnTgChat()" title="লাইভ চ্যাট">
    <div class="sn-tg-circle">
      <!-- 3D Ultra-Luxurious Live Chat Casino Logo -->
      <img src="/assets/live_chat_logo.jpg" alt="Live Chat" class="sn-tg-logo-img" />
      <div class="sn-tg-online-dot"></div>
      <div id="snTgUnreadBadge" class="sn-tg-unread-badge">1</div>
    </div>
    <div class="sn-tg-pill-label">
      <div class="sn-tg-pill-dot"></div>
      <span>লাইভ চ্যাট</span>
    </div>
  </div>

  <!-- Social Icons Column -->
  <div class="sn-side-social-list">
    <!-- Telegram -->
    <a href="https://t.me/sn777top" target="_blank" rel="noopener noreferrer" class="sn-side-social-btn sn-side-social-tg" title="টেলিগ্রাম চ্যানেল ও সাপোর্ট">
      <svg viewBox="0 0 24 24" width="24" height="24" fill="#ffffff" style="transform: translate(-0.5px, 0.5px);">
        <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/>
      </svg>
      <span class="sn-side-tooltip">টেলিগ্রাম</span>
    </a>

    <!-- WhatsApp -->
    <a href="https://t.me/sn777top" target="_blank" rel="noopener noreferrer" class="sn-side-social-btn sn-side-social-wa" title="হোয়াটসঅ্যাপ সাপোর্ট">
      <svg viewBox="0 0 24 24" width="25" height="25" fill="#ffffff">
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.41a8.16 8.16 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.188 8.188 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.07-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.29z"/>
      </svg>
      <span class="sn-side-tooltip">হোয়াটসঅ্যাপ</span>
    </a>

    <!-- Facebook -->
    <a href="https://t.me/sn777top" target="_blank" rel="noopener noreferrer" class="sn-side-social-btn sn-side-social-fb" title="ফেসবুক পেজ">
      <svg viewBox="0 0 24 24" width="24" height="24" fill="#ffffff">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
      <span class="sn-side-tooltip">ফেসবুক</span>
    </a>
  </div>
</div>

<!-- Telegram Live Chat Messenger Modal -->
<div id="snTgChatWindow" class="sn-tg-chat-window">
  <!-- Header -->
  <div class="sn-tg-header">
    <div class="sn-tg-header-left">
      <div class="sn-tg-avatar-box">
        <img src="/assets/live_chat_logo.jpg" alt="Sn777 Support" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" />
        <div class="sn-tg-online-dot" style="width: 10px; height: 10px; top: 0; right: 0;"></div>
      </div>
      <div>
        <div class="sn-tg-info-title">
          <span>Sn777 লাইভ সাপোর্ট</span>
          <span class="sn-tg-verified-icon">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
          </span>
        </div>
        <div class="sn-tg-info-sub">
          <span class="sn-tg-pill-dot"></span>
          <span>অনলাইন • টেলিগ্রাম সাপোর্ট টিম</span>
        </div>
      </div>
    </div>
    <div class="sn-tg-header-actions">
      <a href="https://t.me/sn777top" target="_blank" rel="noopener noreferrer" class="sn-tg-open-app-btn" title="সরাসরি টেলিগ্রাম অ্যাপে খুলুন">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/></svg>
        <span>টেলিগ্রামে যান</span>
      </a>
      <button class="sn-tg-close-btn" onclick="toggleSnTgChat()" title="বন্ধ করুন">✕</button>
    </div>
  </div>

  <!-- User info strip -->
  <div class="sn-tg-user-bar">
    <span>ইউজার: <b id="snTgUserLabel">Guest</b></span>
    <span>ব্যালেন্স: <b id="snTgBalanceLabel">৳0.00</b></span>
  </div>

  <!-- Chat Messages Stream -->
  <div id="snTgMsgContainer" class="sn-tg-body">
    <div class="sn-tg-date-badge">আজ</div>
    
    <!-- Welcome message from admin -->
    <div class="sn-tg-bubble-wrap admin">
      <div class="sn-tg-bubble">
        আসসালামু আলাইকুম! 👋 Sn777 অফিসিয়াল টেলিগ্রাম লাইভ সাপোর্টে আপনাকে স্বাগতম।
        <br><br>
        আপনার ডিপোজিট, উইথড্র, বোনাস বা অ্যাকাউন্ট সংক্রান্ত যেকোনো সমস্যা হলে নিচে লিখুন অথবা দ্রুত উত্তরের জন্য আমাদের টেলিগ্রাম চ্যানেলে যোগাযোগ করুন।
        <div class="sn-tg-bubble-meta">
          <span>সাপোর্ট এজেন্ট</span> • <span>এখন</span>
        </div>
      </div>
      
      <!-- Quick Chips -->
      <div class="sn-tg-quick-chips">
        <div class="sn-tg-chip" onclick="handleSnChipClick('💰 ডিপোজিট জমা হয়নি')">💰 ডিপোজিট জমা হয়নি</div>
        <div class="sn-tg-chip" onclick="handleSnChipClick('💸 উইথড্রল সমস্যা')">💸 উইথড্রল সমস্যা</div>
        <div class="sn-tg-chip" onclick="handleSnChipClick('🎁 ৭৭৭ টাকা বোনাস চাই')">🎁 ৭৭৭ টাকা বোনাস চাই</div>
        <div class="sn-tg-chip" onclick="handleSnChipClick('📱 টেলিগ্রাম গ্রুপে যুক্ত হব')">📱 টেলিগ্রাম গ্রুপ</div>
      </div>
    </div>

    <!-- Dynamic message container -->
    <div id="snTgDynamicMessages" style="display:flex; flex-direction:column; gap:12px;"></div>

    <!-- Typing Indicator -->
    <div id="snTgTypingIndicator" class="sn-tg-typing">
      <div class="sn-tg-typing-dots">
        <span></span><span></span><span></span>
      </div>
      <span>সাপোর্ট প্রতিনিধি লিখছেন...</span>
    </div>
  </div>

  <!-- Footer Input Area -->
  <div class="sn-tg-footer">
    <div class="sn-tg-input-row">
      <input type="file" id="snTgFileInput" accept="image/*" style="display:none;" onchange="handleSnTgPhotoUpload(this)" />
      <button class="sn-tg-attach-btn" onclick="document.getElementById('snTgFileInput').click()" title="ছবি / স্ক্রিনশট পাঠান">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 0 1 5 0v10.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5V6H9v9.5a3 3 0 0 0 6 0V5a4 4 0 0 0-8 0v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/>
        </svg>
      </button>
      <input type="text" id="snTgChatInput" class="sn-tg-input" placeholder="একটি মেসেজ লিখুন..." onkeypress="if(event.key==='Enter') sendSnTgMessage()" />
      <button class="sn-tg-send-btn" onclick="sendSnTgMessage()" title="মেসেজ পাঠান">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="#ffffff" style="margin-left: 2px;">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
        </svg>
      </button>
    </div>
    <div class="sn-tg-bottom-note">
      <span>🔒 এন্ড-টু-এন্ড সুরক্ষিত লাইভ চ্যাট • সরাসরি কথা বলুন <a href="https://t.me/sn777top" target="_blank" rel="noopener noreferrer">@sn777top</a></span>
    </div>
  </div>
</div>

<script>
(function() {
  var deliveredReplyIds = new Set();
  var pollInterval = null;

  function getSnUserInfo() {
    var name = "Guest";
    var userId = "Guest_" + (sessionStorage.getItem("sn777_guest_id") || "");
    var balance = "৳0.00";
    var deposit = "৳0.00";

    if (!sessionStorage.getItem("sn777_guest_id")) {
      var rId = Math.floor(100000 + Math.random() * 900000);
      sessionStorage.setItem("sn777_guest_id", String(rId));
      userId = "Guest_" + rId;
    }

    try {
      var profRaw = localStorage.getItem("sn777_cached_profile_full");
      if (profRaw) {
        var p = JSON.parse(profRaw);
        if (p.username && p.username !== "ব্যবহারকারী") name = p.username;
        else if (p.name && p.name !== "সম্পূর্ণ নাম") name = p.name;
        if (p.uid || p.id || p.username) userId = p.username || p.uid || p.id;
        if (p.balance !== undefined) balance = "৳" + Number(p.balance).toFixed(2);
        if (p.totalDeposited !== undefined) deposit = "৳" + Number(p.totalDeposited).toFixed(2);
      }
    } catch(e) {}

    try {
      var un = localStorage.getItem("sn777_username");
      if (un && un !== "ব্যবহারকারী" && un !== "suya120" && un !== "User") {
        name = un;
        if (userId.startsWith("Guest_")) userId = un;
      }
    } catch(e) {}

    try {
      var visRaw = localStorage.getItem("sn777_cached_visitor");
      if (visRaw) {
        var v = JSON.parse(visRaw);
        if (v.username && v.username !== "ব্যবহারকারী") {
          name = v.username;
          if (userId.startsWith("Guest_")) userId = v.username;
        }
      }
    } catch(e) {}

    return { name: name, userId: userId, balance: balance, deposit: deposit };
  }

  function updateUserInfoStrip() {
    try {
      var u = getSnUserInfo();
      var uEl = document.getElementById("snTgUserLabel");
      var bEl = document.getElementById("snTgBalanceLabel");
      if (uEl) uEl.textContent = u.name;
      if (bEl) bEl.textContent = u.balance;
    } catch(e) {}
  }

  function getTimeStr() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function appendTgBubble(content, type, time, isHtml) {
    var cont = document.getElementById("snTgDynamicMessages");
    if (!cont) return;

    var wrap = document.createElement("div");
    wrap.className = "sn-tg-bubble-wrap " + type;

    var bubble = document.createElement("div");
    bubble.className = "sn-tg-bubble";

    if (isHtml) {
      bubble.innerHTML = content;
    } else {
      bubble.textContent = content;
    }

    var meta = document.createElement("div");
    meta.className = "sn-tg-bubble-meta";
    meta.innerHTML = '<span>' + (time || getTimeStr()) + '</span>' + 
      (type === "user" ? '<span class="sn-tg-check">✓✓</span>' : '');

    bubble.appendChild(meta);
    wrap.appendChild(bubble);
    cont.appendChild(wrap);

    var body = document.getElementById("snTgMsgContainer");
    if (body) {
      setTimeout(function() { body.scrollTop = body.scrollHeight; }, 50);
    }
  }

  function saveMessageToStorage(msgObj) {
    try {
      var u = getSnUserInfo();
      var key = "sn777_tg_chat_history_" + u.userId;
      var arr = JSON.parse(localStorage.getItem(key) || "[]");
      arr.push(msgObj);
      if (arr.length > 80) arr.shift();
      localStorage.setItem(key, JSON.stringify(arr));
    } catch(e) {}
  }

  function loadSavedMessages() {
    try {
      var u = getSnUserInfo();
      var key = "sn777_tg_chat_history_" + u.userId;
      var arr = JSON.parse(localStorage.getItem(key) || "[]");
      var cont = document.getElementById("snTgDynamicMessages");
      if (cont) cont.innerHTML = "";
      arr.forEach(function(item) {
        appendTgBubble(item.content, item.type, item.time, item.isHtml);
      });
    } catch(e) {}
  }

  window.toggleSnTgChat = function() {
    var win = document.getElementById("snTgChatWindow");
    if (!win) return;
    var isVisible = window.getComputedStyle(win).display !== "none";
    if (isVisible) {
      win.style.display = "none";
      if (pollInterval) { clearInterval(pollInterval); pollInterval = null; }
    } else {
      win.style.display = "flex";
      updateUserInfoStrip();
      loadSavedMessages();
      var unread = document.getElementById("snTgUnreadBadge");
      if (unread) unread.style.display = "none";
      var input = document.getElementById("snTgChatInput");
      if (input) setTimeout(function() { input.focus(); }, 150);
      if (!pollInterval) {
        pollInterval = setInterval(fetchTelegramReplies, 3000);
      }
      fetchTelegramReplies();
    }
  };

  // Expose global aliases so existing buttons open this live chat
  window.openTelegramChat = window.toggleSnTgChat;
  window.toggleSnWidget = window.toggleSnTgChat;

  window.handleSnChipClick = function(text) {
    if (text.includes("টেলিগ্রাম গ্রুপ") || text.includes("চ্যানেলে")) {
      window.open("https://t.me/sn777top", "_blank");
      return;
    }
    var input = document.getElementById("snTgChatInput");
    if (input) {
      input.value = text;
      window.sendSnTgMessage();
    }
  };

  window.sendSnTgMessage = function() {
    var input = document.getElementById("snTgChatInput");
    if (!input) return;
    var msg = input.value.trim();
    if (!msg) return;
    input.value = "";

    var timeStr = getTimeStr();
    appendTgBubble(msg, "user", timeStr, false);
    saveMessageToStorage({ content: msg, type: "user", time: timeStr, isHtml: false });

    var u = getSnUserInfo();
    updateUserInfoStrip();

    var typing = document.getElementById("snTgTypingIndicator");
    if (typing) typing.style.display = "flex";

    fetch("/api/send-telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: u.name,
        userId: u.userId,
        balance: u.balance,
        deposit: u.deposit,
        message: msg
      })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      setTimeout(function() {
        if (typing) typing.style.display = "none";
      }, 1000);
    })
    .catch(function(err) {
      console.warn("Telegram send notice:", err);
      setTimeout(function() {
        if (typing) typing.style.display = "none";
      }, 1000);
    });
  };

  window.handleSnTgPhotoUpload = function(fileInput) {
    var file = fileInput.files && fileInput.files[0];
    if (!file) return;

    var reader = new FileReader();
    reader.onload = function(e) {
      var rawDataUrl = e.target.result;
      var img = new Image();
      img.onload = function() {
        var canvas = document.createElement("canvas");
        var maxDim = 1200;
        var width = img.width;
        var height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        var compressedDataUrl = canvas.toDataURL("image/jpeg", 0.82);

        var imgHtml = '<img src="' + compressedDataUrl + '" alt="Attachment" style="max-height: 180px; object-fit: cover;" />';
        var timeStr = getTimeStr();
        appendTgBubble(imgHtml, "user", timeStr, true);
        saveMessageToStorage({ content: imgHtml, type: "user", time: timeStr, isHtml: true });

        var u = getSnUserInfo();
        updateUserInfoStrip();

        var typing = document.getElementById("snTgTypingIndicator");
        if (typing) typing.style.display = "flex";

        fetch("/api/send-telegram-photo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: u.name,
            userId: u.userId,
            balance: u.balance,
            deposit: u.deposit,
            imageBase64: compressedDataUrl
          })
        })
        .then(function(res) { return res.json(); })
        .finally(function() {
          setTimeout(function() {
            if (typing) typing.style.display = "none";
          }, 1200);
        });
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
    fileInput.value = "";
  };

  function fetchTelegramReplies() {
    var u = getSnUserInfo();
    if (!u || !u.userId) return;

    fetch("/api/telegram-replies?userId=" + encodeURIComponent(u.userId))
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (data && data.success && Array.isArray(data.replies)) {
          data.replies.forEach(function(reply) {
            if (deliveredReplyIds.has(reply.id)) return;
            deliveredReplyIds.add(reply.id);

            var replyText = reply.text;
            if (replyText.toUpperCase() === "CLEAR") {
              var cont = document.getElementById("snTgDynamicMessages");
              if (cont) cont.innerHTML = "";
              try {
                localStorage.removeItem("sn777_tg_chat_history_" + u.userId);
              } catch(e) {}
            } else {
              var timeStr = reply.time || getTimeStr();
              appendTgBubble(replyText, "admin", timeStr, false);
              saveMessageToStorage({ content: replyText, type: "admin", time: timeStr, isHtml: false });

              var win = document.getElementById("snTgChatWindow");
              var isHidden = !win || window.getComputedStyle(win).display === "none";
              if (isHidden) {
                var badge = document.getElementById("snTgUnreadBadge");
                if (badge) badge.style.display = "flex";
              }
            }
          });
        }
      })
      .catch(function(err) {});
  }

  // Periodic background check for replies even when chat is minimized
  setInterval(fetchTelegramReplies, 12000);

  // Initial setup on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function() {
      updateUserInfoStrip();
    });
  } else {
    updateUserInfoStrip();
  }
})();
</script>
<!-- End Sn777 Official Telegram Live Chat Widget -->
`;

function patchTarget(filePath) {
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, "utf8");

  // Remove any old widget instances
  html = html.replace(/<!-- Sn777 Official Telegram Live Chat Widget -->[\s\S]*?<!-- End Sn777 Official Telegram Live Chat Widget -->/g, "");
  html = html.replace(/<div class="sn-tg-btn"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g, "");
  html = html.replace(/<div class="sn-chat-btn"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g, "");

  // Inject before closing </body> tag
  if (html.includes("</body>")) {
    html = html.replace("</body>", tgWidgetHTML + "\n</body>");
  } else {
    html += "\n" + tgWidgetHTML;
  }

  fs.writeFileSync(filePath, html, "utf8");
  console.log("[Telegram LiveChat] Injected successfully into", filePath);
}

["index.html", "dist/index.html", "dist_backup/index.html"].forEach(patchTarget);
