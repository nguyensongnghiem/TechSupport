import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { v4 as uuidv4 } from "uuid"; // Đảm bảo bạn đã cài đặt thư viện 'uuid'

// Hàm tạo sessionId ngẫu nhiên (UUID v4)
function generateSessionId() {
  return uuidv4();
}

function ChatbotPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Tạo hoặc lấy sessionId từ sessionStorage khi component mount
  useEffect(() => {
    let storedId = sessionStorage.getItem("chatbotSessionId");
    if (!storedId) {
      storedId = generateSessionId();
      sessionStorage.setItem("chatbotSessionId", storedId);
    }
    setSessionId(storedId);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

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
      const res = await fetch(
        "https://digithub.io.vn/webhook/2470f88a-8804-4b81-a421-69fe10b9c3e4/chat",
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
    // Outer container:
    // Giả định header cao 56px (pt-14) và cố định. Điều chỉnh nếu khác.
    // Loại bỏ justify-center vì chatbot sẽ chiếm toàn bộ chiều cao có thể.
    <div className="flex flex-col items-center bg-gray-50 h-[calc(100vh-56px)] pt-14">
      {/* Main chatbot box */}
      {/* Thay đổi max-w-xl thành max-w-2xl hoặc 3xl để rộng hơn trên màn hình lớn */}
      <div className="w-full max-w-xl sm:max-w-2xl lg:max-w-3xl bg-white rounded-xl shadow-2xl p-4 sm:p-6 flex flex-col h-full"> {/* <--- ĐIỀU CHỈNH CHÍNH */}
        {/* Chatbot Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-3 flex-shrink-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Hỗ trợ kỹ thuật 24/7</h1>
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

        {/* Message Area: flex-1 for growth, overflow-y-auto for scrolling */}
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
                // ĐIỀU CHỈNH CHÍNH Ở ĐÂY:
                // - Đặt w-full để tin nhắn luôn chiếm 100% chiều ngang của flex container cha
                // - Đảm bảo tin nhắn có khoảng cách với mép màn hình đối diện bằng cách sử dụng margin tự động
                className={`max-w-[90%] px-4 py-2 rounded-lg shadow-md ${ // <--- ĐIỀU CHỈNH NÀY
                  msg.sender === "user"
                    ? "bg-blue-600 text-white rounded-br-none ml-auto mr-0"
                    : "bg-gray-200 text-gray-800 rounded-bl-none mr-auto ml-0"
                }`}
              >
                {msg.sender === "bot" ? (
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center justify-start mb-4">
              <div className="flex items-center px-4 py-2 rounded-lg bg-gray-200 text-gray-700 shadow-md rounded-bl-none">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-blue-500"
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

        {/* Input Area: flex-shrink-0 to maintain height */}
        <div className="flex gap-2 sm:gap-3 pt-3 border-t border-gray-200 flex-shrink-0">
          <input
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 sm:px-5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400 text-sm sm:text-base"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Nhập tin nhắn của bạn..."
            disabled={isLoading}
          />
          <button
            className={`bg-blue-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-md font-semibold shadow-lg transition duration-300 ease-in-out text-sm sm:text-base ${
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
              "Gửi"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatbotPage;