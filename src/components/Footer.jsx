import React from "react";
import { Typography } from "@material-tailwind/react";

function Footer() {
  return (
    <footer className="w-full bg-blue-800  shadow-md flex-shrink-0 border-t border-gray-200">
      <div className="container mx-auto text-center">
        {/* <Typography color="blue-gray" className="font-normal">
          &copy; {new Date().getFullYear()} Tech Support Portal. All Rights
          Reserved.
        </Typography> */}
        <Typography color="white" className="text-sm py-1  ">
          Developed by DigitHub
        </Typography>
      </div>
    </footer>
  );
}

export default Footer;
