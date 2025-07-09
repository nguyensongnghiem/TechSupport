import React from "react";

const Header = () => {
  return (
    <header className="flex w-full items-center gap-x-4 bg-gray-200 px-4 py-2 shadow">
      {/* Bọc logo trong thẻ <a> để tạo liên kết */}
      <a href="/" className="flex items-center"> {/* Thêm flex items-center để giữ ảnh và text logo thẳng hàng nếu có */}
        <img src="/images/cang_logo.png" alt="logo" className="h-10 mr-3" />
        {/* Nếu bạn muốn có text bên cạnh logo, hãy thêm vào đây */}
        {/* <span className="text-lg font-bold text-blue-800">Tên trang chủ của bạn</span> */}
      </a>
      {/* Thẻ span cũ có vẻ trống, tôi sẽ giữ nó nếu bạn có ý định dùng sau này, hoặc có thể xóa đi */}
      <span className="text-lg font-bold text-blue-800">
      </span>
    </header>
  );
};

export default Header;