import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { v4 as uuidv4 } from "uuid";
import { FaPaperPlane } from "react-icons/fa";

// Hàm tạo sessionId ngẫu nhiên (UUID v4)
function generateSessionId() {
  return uuidv4();
}

// Lấy URL của webhook từ biến môi trường
// Cú pháp sẽ khác nhau tùy thuộc vào công cụ build của bạn
const CHATBOT_WEBHOOK_URL = import.meta.env.VITE_CHATBOT_WEBHOOK_URL;
console.log("CHATBOT_WEBHOOK_URL:", CHATBOT_WEBHOOK_URL);
// Bạn nên sử dụng một URL dự phòng hợp lý hoặc một thông báo lỗi nếu URL là bắt buộc.
// Ví dụ: console.error("CHATBOT_WEBHOOK_URL is not defined!");
// Hoặc throw new Error("CHATBOT_WEBHOOK_URL environment variable is missing.");

function ChatbotPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // Cuộn xuống cuối tin nhắn khi có tin nhắn mới hoặc trạng thái tải thay đổi
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Tạo hoặc lấy sessionId từ sessionStorage khi component mount
  // Thêm lời chào của bot
  useEffect(() => {
    let storedId = sessionStorage.getItem("chatbotSessionId");
    if (!storedId) {
      storedId = generateSessionId();
      sessionStorage.setItem("chatbotSessionId", storedId);
    }
    setSessionId(storedId);

    // Add initial greeting from the bot
    setMessages([
      {
        sender: "bot",
        text: "Chào bạn! Tôi là một trợ lý AI hỗ trợ kỹ thuật 24/7 với các vấn đề về kỹ thuật thiết bị tại Cảng Đà Nẵng. Tôi có thể giúp gì cho bạn hôm nay?",
      },
    ]);
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { sender: "user", text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setIsLoading(true);

    const payload = {
      action: "sendMessage",
      sessionId: sessionId,
      route: "general",
      chatInput: input,
      metadata: {
        userId: "",
      },
    };

    try {
      // SỬ DỤNG BIẾN MÔI TRƯỜNG Ở ĐÂY
      const res = await fetch(
        CHATBOT_WEBHOOK_URL, // <-- Đã thay thế URL nhúng cứng bằng biến môi trường
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Lỗi HTTP:", res.status, errorText);
        throw new Error(`Server returned an error: ${res.status}`);
      }

      const data = await res.json();
      console.log("Dữ liệu nhận được từ server:", data);

      if (data && data.output) {
        setMessages((msgs) => [...msgs, { sender: "bot", text: data.output }]);
      } else {
        setMessages((msgs) => [
          ...msgs,
          {
            sender: "bot",
            text: "Xin lỗi, tôi không nhận được phản hồi hợp lệ.",
          },
        ]);
        console.warn("Phản hồi từ server không có trường 'output':", data);
      }
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn hoặc xử lý phản hồi:", error);
      setMessages((msgs) => [
        ...msgs,
        {
          sender: "bot",
          text: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-50 h-[calc(100vh-56px)] pt-4 sm:pt-8 pb-4">
      <div className="w-[95%] max-w-xl sm:max-w-2xl lg:max-w-3xl bg-white rounded-xl shadow-2xl p-4 sm:p-6 flex flex-col h-full">
        <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-3 flex-shrink-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Hỗ trợ kỹ thuật 24/7
          </h1>
          <svg
            className="w-7 h-7 sm:w-8 sm:h-8 text-blue-500 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            ></path>
          </svg>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {messages.length === 0 && !isLoading && (
            <div className="flex items-center justify-center h-full text-gray-500 italic">
              Bắt đầu cuộc trò chuyện của bạn...
            </div>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex mb-4 ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] px-3 py-2 sm:px-4 sm:py-2 rounded-lg shadow-md ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white rounded-br-none ml-auto"
                    : "bg-gray-200 text-gray-800 rounded-bl-none mr-auto"
                }`}
              >
                {msg.sender === "bot" ? (
                  <div className="prose prose-sm max-w-none text-sm sm:text-base">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                ) : (
                  <span className="text-sm sm:text-base">{msg.text}</span>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center justify-start mb-4">
              <div className="flex items-center px-3 py-2 rounded-lg bg-gray-200 text-gray-700 shadow-md rounded-bl-none text-sm sm:text-base">
                <svg
                  className="animate-spin h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-blue-500"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                <span>Chatbot đang trả lời...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2 sm:gap-3 pt-3 border-t border-gray-200 flex-shrink-0">
          <input
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm sm:px-4 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Nhập tin nhắn của bạn..."
            disabled={isLoading}
          />
          <button
            className={`flex items-center justify-center bg-blue-600 text-white px-3 py-2 sm:px-5 sm:py-2.5 rounded-md font-semibold shadow-lg transition duration-300 ease-in-out text-sm sm:text-base ${
              isLoading
                ? "opacity-60 cursor-not-allowed"
                : "hover:bg-blue-700 transform hover:scale-105"
            }`}
            onClick={sendMessage}
            disabled={isLoading}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            ) : (
              <>
                <FaPaperPlane className="h-4 w-4 mr-1 sm:mr-2" />
                Gửi
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatbotPage;