import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, Button, Typography } from "@material-tailwind/react";
import {
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

function HomePage() {
  return (
    <div className="flex items-center justify-center h-full bg-gray-300">
      <div className="container mx-auto px-4">
        <div className="flex-col md:flex-row flex items-center justify-center gap-8">
          <div className="w-full max-w-[350px] lg:max-w-[400px] p-4 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center">              
              <img
                src="/images/app_logo.png"
                alt="CraneCare"
                className="object-cover object-center transition-transform duration-300 ease-in-out h-24 w-24 "
              />
              {/* Link cũng cần là flex để căn giữa nếu img nhỏ hơn */}
              <img
                src="/images/info.png"
                alt="CraneCare"
                className="w-full h-auto object-cover object-center transition-transform duration-300 ease-in-out"
              />
            </div>
          </div>
          <div className="w-full max-w-[170px] lg:max-w-[220px] p-4">
            <Link to="/pdf-viewer">
              <img
                src="/images/lib_icon.png"
                alt="Crane Library"
                className="w-full h-auto  object-cover object-center transition-transform duration-300 ease-in-out hover:scale-110"
              />
            </Link>
          </div>

          <div className="w-full max-w-[170px] lg:max-w-[220px] p-4">
            <Link to="/chatbot">
              <img
                src="/images/chatbot_icon.png"
                alt="Crane IQ"
                className="w-full h-auto  object-fit object-center transition-transform duration-300 ease-in-out hover:scale-110"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
