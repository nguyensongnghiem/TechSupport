import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { v4 as uuidv4 } from "uuid";
import { FaPaperPlane, FaRobot, FaUserCircle } from "react-icons/fa";
import { Typewriter } from "react-simple-typewriter";
import { Switch } from "@material-tailwind/react";
import Header from "../components/Header";
const CHATBOT_WEBHOOK_URL = import.meta.env.VITE_CHATBOT_WEBHOOK_URL;

function generateSessionId() {
  return uuidv4();
}

function ChatbotPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [typingOutput, setTypingOutput] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, typingOutput]);

  useEffect(() => {
    let storedId = sessionStorage.getItem("chatbotSessionId");
    if (!storedId) {
      storedId = generateSessionId();
      sessionStorage.setItem("chatbotSessionId", storedId);
    }
    setSessionId(storedId);
    setMessages([
      {
        sender: "bot",
        text: "🤖 Xin chào! Tôi là trợ lý trí tuệ nhân tạo cho Cảng Đà Nẵng. Bạn cần tôi hỗ trợ điều gì hôm nay?",
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
      sessionId,
      route: "general",
      chatInput: userMsg.text,
      metadata: { userId: "" },
    };

    try {
      const res = await fetch(CHATBOT_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      const botText = data?.output || "⚠️ Không nhận được phản hồi hợp lệ.";

      setTypingOutput("");
      setTimeout(() => {
        setTypingOutput(botText);
      }, 300);
    } catch (err) {
      console.error(err);
      setTypingOutput("❌ Có lỗi xảy ra. Hãy thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!typingOutput) return;
    const botMsg = { sender: "bot", text: typingOutput };
    setMessages((msgs) => [...msgs, botMsg]);
    setTypingOutput("");
  }, [typingOutput]);

  const themeClasses = darkMode
    ? {
        bg: "bg-gray-900",
        card: "bg-gray-800 text-white border-gray-700",
        input: "bg-gray-700 text-white border-gray-600 placeholder-gray-400",
        botBubble: "bg-gray-700 text-gray-100 border border-gray-600",
        userBubble: "bg-gradient-to-br from-cyan-500 to-blue-500 text-white",
        header: "bg-gray-850 border-gray-700 text-cyan-400",
      }
    : {
        bg: "bg-gray-100",
        card: "bg-white text-gray-900 border-gray-200",
        input: "bg-white text-gray-800 border-gray-300 placeholder-gray-400",
        botBubble: "bg-gray-200 text-gray-800 border border-gray-300",
        userBubble: "bg-gradient-to-br from-cyan-500 to-blue-500 text-white",
        header: "bg-white border-gray-200 text-cyan-600",
      };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div
        className={`flex items-center justify-center ${themeClasses.bg}
                    h-[calc(100vh-57px)]
                    md:px-4 md:py-6
                    `}
      >
        <div
          className={`w-full h-full flex flex-col overflow-hidden border
                      ${themeClasses.card}
                      md:rounded-2xl md:shadow-xl
                      rounded-none shadow-none // Đảm bảo không có bo tròn hay bóng ở màn hình nhỏ hơn md
                      md:max-w-2xl xl:max-w-4xl // <<< Đã thêm xl:max-w-4xl ở đây
                    `}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between px-6 py-4 border-b ${themeClasses.header} shadow-md`}
          >
            <div className="text-xl font-semibold flex items-center gap-2">
              <img
                className="h-7 lg:h-9 rounded-full object-cover object-center"
                src="/images/Artboard 8.png"
                alt="CraneIQ logo"
              />
              {/* <span className={`${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>AI Chatbot</span> */}
            </div>
            {/* <Switch
              onClick={() => setDarkMode(!darkMode)}
              ripple={false}
              className="h-full w-full checked:bg-gradient-to-r from-cyan-500 to-blue-500"
              containerProps={{
                className: "w-11 h-6",
              }}
              circleProps={{
                className: "before:hidden left-0.5 border-none",
              }}
            /> */}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex items-end gap-2 ${
                    msg.sender === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  {msg.sender === "bot" && (
                    <FaRobot className="text-xl text-cyan-500 flex-shrink-0" />
                  )}
                  {msg.sender === "user" && (
                    <FaUserCircle className="text-xl text-gray-400 flex-shrink-0" />
                  )}
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-xl text-md leading-relaxed shadow ${
                      msg.sender === "user"
                        ? `${themeClasses.userBubble} rounded-br-none`
                        : `${themeClasses.botBubble} rounded-bl-none`
                    }`}
                  >
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-gray-500 text-md animate-pulse ">
                <FaRobot />
                <span>
                  <Typewriter
                    words={["Đang phản hồi..."]}
                    loop={1}
                    typeSpeed={80}
                    deleteSpeed={50}
                  />
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className={`border-t px-4 py-3 ${themeClasses.header}`}>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                disabled={isLoading}
                placeholder="Nhập tin nhắn..."
                className={`flex-1 px-4 py-2 rounded-lg ${themeClasses.input} focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm shadow-sm`}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading}
                className={`flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-md ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <FaPaperPlane className="mr-2" />
                Gửi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatbotPage;
