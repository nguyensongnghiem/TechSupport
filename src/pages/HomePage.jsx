import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, Button, Typography } from "@material-tailwind/react";
import {
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-300">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-8">
          {/* Card: Xem tài liệu */}
          <Card className="w-full max-w-sm shadow-lg border border-gray-200 ">
            <CardBody className="flex flex-col text-center p-6">
              <div className="flex justify-center mb-3">
                <DocumentTextIcon className="h-12 w-12 text-blue-600" />
              </div>
              <Typography variant="h3" color="gray" className="mb-3">
                Tra cứu tài liệu
              </Typography>
              <Typography color="gray" className="flex-grow">
                Truy cập tài liệu kỹ thuật của chúng tôi một cách trực quan và
                hiệu quả.
              </Typography>
              <Link to="/pdf-viewer">
                <Button className="mt-6 bg-blue-600 text-white shadow-md ">
                  Vào trang tra cứu
                </Button>
              </Link>
            </CardBody>
          </Card>

          {/* Card: Chatbot Hỗ trợ */}
          <Card className="w-full max-w-sm shadow-lg border border-gray-200 ">
            <CardBody className="flex flex-col text-center p-6">
              <div className="flex justify-center mb-3">
                <ChatBubbleLeftRightIcon className="h-12 w-12 text-blue-600" />
              </div>
              <Typography variant="h3" color="gray" className="mb-3">
                Chatbot Hỗ trợ
              </Typography>
              <Typography color="gray" className="flex-grow">
                Tôi là hỗ trợ 24/7 của bạn ! Cần tra cứu lỗi của các thiết bị.
                Hãy hỏi tôi ?
              </Typography>
              <Link to="/chatbot">
                <Button className="mt-6 bg-blue-600 text-white shadow-md ">
                  Vào trang Chatbot
                </Button>
              </Link>
              {/* <a
                href="http://chatbot.digithub.io.vn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="mt-6 bg-blue-600 text-white shadow-md ">
                  Bắt đầu Chat
                </Button>
              </a> */}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
