import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../context';
import { ROUTES } from '../../constants';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      toast.success(`Đã đăng ký nhận thông báo mẻ lò mới cho email: ${email}`);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-[#f6efe7] border-t border-[#e8ded2] text-[#6b584a] font-sans pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Lưới 4 cột nội dung chính */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#e5d6c8]">
          {/* Cột 1: Tuyên ngôn thương hiệu */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#c2652a] text-white flex items-center justify-center font-serif font-bold text-sm shadow-sm">
                M
              </div>
              <span className="font-serif text-lg font-bold tracking-wider text-[#2b241e] uppercase">
                Gốm Mộc
              </span>
            </div>

            <p className="font-serif italic text-xs leading-relaxed text-[#4a3f35]">
              “Hồn cốt của đất sa thạch nung qua lửa mộc, nơi sự không hoàn hảo tạo nên kiệt tác vĩnh cửu.”
            </p>

            <p className="text-xs leading-relaxed text-[#756253]">
              Mỗi tác phẩm tại Gốm Mộc là sự thăng hoa giữa đất sét thô vùng duyên hải, men tro nung củi truyền thống và đôi bàn tay nhẫn nại của những nghệ nhân gìn giữ di sản nung mộc Việt Nam.
            </p>

            <div className="flex items-start gap-2 text-xs text-[#524337] pt-2">
              <svg
                className="w-4 h-4 text-[#c2652a] shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>
                Xưởng chế tác: Làng lò nung Sa Thạch, Quảng Nam & Làng gốm Bát Tràng, Gia Lâm, Hà Nội
              </span>
            </div>
          </div>

          {/* Cột 2: Tác phẩm tuyển chọn */}
          <div className="space-y-3.5">
            <h4 className="font-serif font-bold text-sm text-[#2b241e] tracking-wide uppercase border-l-2 border-[#c2652a] pl-2.5">
              Tác Phẩm Gốm
            </h4>
            <ul className="space-y-2.5 text-xs text-[#756253]">
              <li>
                <Link to={ROUTES.PRODUCTS} className="hover:text-[#c2652a] transition-colors">
                  Bình Hoa Men Tro Nham Thạch
                </Link>
              </li>
              <li>
                <Link to={ROUTES.PRODUCTS} className="hover:text-[#c2652a] transition-colors">
                  Bộ Trà Đạo Sa Thạch Nung Củi 1.300°C
                </Link>
              </li>
              <li>
                <Link to={ROUTES.PRODUCTS} className="hover:text-[#c2652a] transition-colors">
                  Đĩa Mộc Bàn Ăn Khắc Chỉ Thủ Công
                </Link>
              </li>
              <li>
                <Link to={ROUTES.PRODUCTS} className="hover:text-[#c2652a] transition-colors">
                  Điêu Khắc Gốm Tĩnh Lặng Thiền Định
                </Link>
              </li>
              <li>
                <Link to={ROUTES.PRODUCTS} className="hover:text-[#c2652a] transition-colors">
                  Phiên Bản Giới Hạn Mẻ Lò 04
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Bảo hiểm & Cam kết */}
          <div className="space-y-3.5">
            <h4 className="font-serif font-bold text-sm text-[#2b241e] tracking-wide uppercase border-l-2 border-[#c2652a] pl-2.5">
              Bảo Hiểm & Dịch Vụ
            </h4>
            <ul className="space-y-2.5 text-xs text-[#756253]">
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-[#c2652a]" />
                Đóng gói an toàn 5 lớp đệm rơm khử ẩm
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-[#c2652a]" />
                Bảo hiểm bể vỡ hoàn tiền 100% khi nhận
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-[#c2652a]" />
                Chứng nhận nghệ nhân chế tác & mã lưu ký
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-[#c2652a]" />
                Hướng dẫn dưỡng men & lau chùi gốm mộc
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-[#c2652a]" />
                Đặt tác phẩm theo đơn riêng (Bespoke)
              </li>
            </ul>
          </div>

          {/* Cột 4: Form nhận tin mẻ lò mới */}
          <div className="space-y-3.5">
            <h4 className="font-serif font-bold text-sm text-[#2b241e] tracking-wide uppercase border-l-2 border-[#c2652a] pl-2.5">
              Mẻ Lò Sắp Tới
            </h4>
            <p className="text-xs leading-relaxed text-[#756253]">
              Đăng ký để nhận thông báo sớm nhất khi mỗi mẻ lò mới khai hỏa và mở bán các tác phẩm độc bản số lượng giới hạn.
            </p>
            <form onSubmit={handleSubmit} className="space-y-2 pt-1">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn..."
                className="w-full bg-white text-xs text-[#2b241e] placeholder-[#a5836a] px-3.5 py-2.5 rounded-sm border border-[#d8c7b8] focus:border-[#c2652a] focus:ring-2 focus:ring-[#c2652a]/20 outline-none transition-all"
              />
              <button
                type="submit"
                className="w-full bg-[#c2652a] hover:bg-[#a8521d] text-white text-xs font-semibold py-2.5 px-4 rounded-sm transition-all duration-200 shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>Đăng Ký Nhận Tin</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </form>
            <span className="block text-[10px] text-[#9c8574]">
              Không gửi spam. Tối đa 2 thư/tháng khi mở lò.
            </span>
          </div>
        </div>

        {/* Thanh bản quyền & chứng chỉ đáy trang */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8c7462]">
          <p>© 2024–2026 Gốm Mộc Atelier. Bản quyền thuộc về nghệ thuật gốm thủ công tự nhiên.</p>
          <div className="flex items-center gap-6 text-xs flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3f784c]"></span>
              Bảo hiểm vận chuyển 5 lớp
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c2652a]"></span>
              Giao hàng bọc gỗ chuyên dụng
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c27d14]"></span>
              Thanh toán bảo mật SSL
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
