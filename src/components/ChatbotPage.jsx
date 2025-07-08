import React from 'react';
import N8nChatbot from './N8nChatbot';
import { Link } from 'react-router-dom';
import { Button, Typography } from "@material-tailwind/react";

function ChatbotPage() {
  return (
    <div className="flex flex-col h-screen w-screen justify-center items-center bg-gray-100">
      <Button as={Link} to="/" className="absolute top-4 left-4 bg-white text-gray-700 shadow-sm rounded-none normal-case">
        Quay lại Trang chủ
      </Button>
      <Typography variant="h1" color="gray" className="mb-6">
        n8n Chatbot
      </Typography>
      <div className="w-11/12 h-4/5 border border-gray-300 shadow-lg overflow-hidden">
        <N8nChatbot />
      </div>
    </div>
  );
}

export default ChatbotPage;
