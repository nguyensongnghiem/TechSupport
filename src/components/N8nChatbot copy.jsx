import { useEffect } from 'react';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';

function N8nChatbot() {
  useEffect(() => {
    // Webhook URL của n8n mà bạn đã cung cấp
    const webhookUrl = 'https://and0zdaz.n8npanel.com/webhook/2470f88a-8804-4b81-a421-69fe10b9c3e4/chat';

    createChat({
      webhookUrl: webhookUrl,
    });

    // Component này không render ra giao diện trực tiếp, 
    // mà dựa vào thư viện @n8n/chat để tạo chatbot widget.
    // Không cần hàm dọn dẹp ở đây vì createChat quản lý vòng đời của widget.
  }, []); 

  return null; 
}

export default N8nChatbot;