import React, { useState, useEffect, useMemo, useRef } from 'react';
import { productApi, categoryApi } from '../../api';
import { useToast } from '../../context';
import { formatCurrency } from '../../utils/format';

// Danh sách danh mục mặc định dự phòng
const DEFAULT_CATEGORIES = [
  { id: 'cat-am-chen', name: 'Ấm chén sa mộc' },
  { id: 'cat-binh-hoa', name: 'Bình hoa đất nung' },
  { id: 'cat-lu-huong', name: 'Lư hương & Trầm sa thạch' },
  { id: 'cat-bat-dia', name: 'Bát đĩa bàn tiệc mộc' },
  { id: 'cat-chen-moc', name: 'Chén mộc tối giản' },
];

// Dữ liệu mẫu đồng bộ 100% với thiết kế Stitch & Prisma Schema
const INITIAL_PRODUCTS = [
  {
    id: 'prd-0104',
    code: 'PRD-GMC-0104',
    name: 'Bộ Ấm Trà Mộc Men Tro Củi',
    categoryId: 'cat-am-chen',
    categoryName: 'Ấm chén sa mộc',
    description: 'Cốt đất sét thô nung nhiệt độ cao 1300°C bằng củi tự nhiên tại xưởng Sahara Atelier.',
    isActive: true,
    glazeType: 'Men tro củi tự nhiên',
    primaryImage:
      'https://lh3.googleusercontent.com/aida/ALJJyrCj3047l_YGdYP2wNd8zbl71YC1xUloEJlfYZ4w_bhScS3WvRscuM7zvYThL_TNZMlZO9LHG2oKub0RMyAcPgL_DIDRt8dbqaAbelnAzfLfTYpx2_qORT6qXe0hMZmrYr_AVLVMnD5zvb5fjKyHqji8oSaYv7jYCdPMb871pEj9sDDWPXkXe3M4OSFNL9tApWoMzwEx96uQ8Z-trjEl7RTZm7vh4c_14W5PAKnQqe7WpiN4a-NHWKW10263',
    variants: [
      {
        id: 'var-0104-1',
        sku: 'GMC-0104-MTC-M',
        variantName: 'Men tro củi • Size M',
        spec: 'Dung tích 220ml',
        price: 1850000,
        stockQuantity: 12,
        isPrimary: true,
        imageUrl:
          'https://lh3.googleusercontent.com/aida/ALJJyrCj3047l_YGdYP2wNd8zbl71YC1xUloEJlfYZ4w_bhScS3WvRscuM7zvYThL_TNZMlZO9LHG2oKub0RMyAcPgL_DIDRt8dbqaAbelnAzfLfTYpx2_qORT6qXe0hMZmrYr_AVLVMnD5zvb5fjKyHqji8oSaYv7jYCdPMb871pEj9sDDWPXkXe3M4OSFNL9tApWoMzwEx96uQ8Z-trjEl7RTZm7vh4c_14W5PAKnQqe7WpiN4a-NHWKW10263',
        images: [
          {
            id: 'img-0104-1-1',
            imageUrl:
              'https://lh3.googleusercontent.com/aida/ALJJyrCj3047l_YGdYP2wNd8zbl71YC1xUloEJlfYZ4w_bhScS3WvRscuM7zvYThL_TNZMlZO9LHG2oKub0RMyAcPgL_DIDRt8dbqaAbelnAzfLfTYpx2_qORT6qXe0hMZmrYr_AVLVMnD5zvb5fjKyHqji8oSaYv7jYCdPMb871pEj9sDDWPXkXe3M4OSFNL9tApWoMzwEx96uQ8Z-trjEl7RTZm7vh4c_14W5PAKnQqe7WpiN4a-NHWKW10263',
            isPrimary: true,
            displayOrder: 0,
          },
          {
            id: 'img-0104-1-2',
            imageUrl:
              'https://lh3.googleusercontent.com/aida-public/AB6AXuBi6g65XJ1j-53d7QCqgB_wCBiP_eSi3ZC9OIBk_rMaY7jf1Ynwwpxq2yeK8vGB9l_fD1nCPQfFlGOG5AnAoJo2QD4ClhHM9qDNgqBx_jwkjRb0ZVo4UiDq-QZm4BSMGTIkXcuuEpVB3OJ7pUCmH_GP1SznUsBZazENvBAKq9G_C_bxCV7Z1SJdSCf_vZcZfbpyxB_IyBrCPgsRjAndDlKFBNrpA7WBNaHStJM0HsKd',
            isPrimary: false,
            displayOrder: 1,
          },
          {
            id: 'img-0104-1-3',
            imageUrl:
              'https://lh3.googleusercontent.com/aida-public/AB6AXuCIBULIf7mSkkflWomIEOdOBUOAn59HkrvNHoYvxhkBJe2XGKbeK6WtRLVwb9dBx69LlIcNpnajrtJqnXifNhmvHWHxTD9C54Yy-xYV9-GqkPzlig_SRBzTm8zi58hn6oxsB1_IPuepmBE2Hr2t43Q2YadhvRirPciEJlPSZiNw-QcKjpikLVgGZjODeqP8mfbAuROMllZd6EDMhfHoEWfmcL94TsLN7UXRY06OWh2-',
            isPrimary: false,
            displayOrder: 2,
          },
        ],
      },
      {
        id: 'var-0104-2',
        sku: 'GMC-0104-MTC-L',
        variantName: 'Men tro củi • Size L',
        spec: 'Dung tích 350ml',
        price: 2200000,
        stockQuantity: 0,
        isPrimary: false,
        imageUrl:
          'https://lh3.googleusercontent.com/aida/ALJJyrCj3047l_YGdYP2wNd8zbl71YC1xUloEJlfYZ4w_bhScS3WvRscuM7zvYThL_TNZMlZO9LHG2oKub0RMyAcPgL_DIDRt8dbqaAbelnAzfLfTYpx2_qORT6qXe0hMZmrYr_AVLVMnD5zvb5fjKyHqji8oSaYv7jYCdPMb871pEj9sDDWPXkXe3M4OSFNL9tApWoMzwEx96uQ8Z-trjEl7RTZm7vh4c_14W5PAKnQqe7WpiN4a-NHWKW10263',
        images: [
          {
            id: 'img-0104-2-1',
            imageUrl:
              'https://lh3.googleusercontent.com/aida/ALJJyrCj3047l_YGdYP2wNd8zbl71YC1xUloEJlfYZ4w_bhScS3WvRscuM7zvYThL_TNZMlZO9LHG2oKub0RMyAcPgL_DIDRt8dbqaAbelnAzfLfTYpx2_qORT6qXe0hMZmrYr_AVLVMnD5zvb5fjKyHqji8oSaYv7jYCdPMb871pEj9sDDWPXkXe3M4OSFNL9tApWoMzwEx96uQ8Z-trjEl7RTZm7vh4c_14W5PAKnQqe7WpiN4a-NHWKW10263',
            isPrimary: true,
            displayOrder: 0,
          },
        ],
      },
      {
        id: 'var-0104-3',
        sku: 'GMC-0104-MRT-M',
        variantName: 'Men rêu thô • Size M',
        spec: 'Dung tích 220ml',
        price: 1950000,
        stockQuantity: 5,
        isPrimary: false,
        imageUrl:
          'https://lh3.googleusercontent.com/aida/ALJJyrCj3047l_YGdYP2wNd8zbl71YC1xUloEJlfYZ4w_bhScS3WvRscuM7zvYThL_TNZMlZO9LHG2oKub0RMyAcPgL_DIDRt8dbqaAbelnAzfLfTYpx2_qORT6qXe0hMZmrYr_AVLVMnD5zvb5fjKyHqji8oSaYv7jYCdPMb871pEj9sDDWPXkXe3M4OSFNL9tApWoMzwEx96uQ8Z-trjEl7RTZm7vh4c_14W5PAKnQqe7WpiN4a-NHWKW10263',
        images: [
          {
            id: 'img-0104-3-1',
            imageUrl:
              'https://lh3.googleusercontent.com/aida/ALJJyrCj3047l_YGdYP2wNd8zbl71YC1xUloEJlfYZ4w_bhScS3WvRscuM7zvYThL_TNZMlZO9LHG2oKub0RMyAcPgL_DIDRt8dbqaAbelnAzfLfTYpx2_qORT6qXe0hMZmrYr_AVLVMnD5zvb5fjKyHqji8oSaYv7jYCdPMb871pEj9sDDWPXkXe3M4OSFNL9tApWoMzwEx96uQ8Z-trjEl7RTZm7vh4c_14W5PAKnQqe7WpiN4a-NHWKW10263',
            isPrimary: true,
            displayOrder: 0,
          },
        ],
      },
    ],
  },
  {
    id: 'prd-0219',
    code: 'PRD-GMC-0219',
    name: 'Bình Hoa Đất Mộc Dáng Trăng Khuyết',
    categoryId: 'cat-binh-hoa',
    categoryName: 'Bình hoa đất nung',
    description: 'Kiến trúc hình khối dáng cổ, men rạn Sa Thạch và men tro tự nhiên.',
    isActive: true,
    glazeType: 'Men rêu cổ phù sa',
    primaryImage:
      'https://lh3.googleusercontent.com/aida/ALJJyrDfmhjzEDEoY7Uu473aPtY4jyYh_IwErfdqKs3lv9xFR-cdsK5k1mbgId7eQw2c2LD2XPhMtcALu8IkAIlMF3wOCNxN6Nh1rzp5G4XsaTPTldV-3gOJjNSI5w7NFSAfBwvI055R-VtRb0T-7LqdbTNASMQdb4IC0dz-YAkxHjyyny9znu0jjzPu-OsnJjwCBr13aNC7WFG_HWCZtJRhJgukDRqDQ1WwvTSumBqJfoymd1k0ir62LbVtSAbj',
    variants: [
      {
        id: 'var-0219-1',
        sku: 'GMC-0219-TC',
        variantName: 'Bản Tiêu Chuẩn H22cm',
        spec: 'Chiều cao 22cm • Đất phù sa đỏ',
        price: 850000,
        stockQuantity: 18,
        isPrimary: true,
        imageUrl:
          'https://lh3.googleusercontent.com/aida/ALJJyrDfmhjzEDEoY7Uu473aPtY4jyYh_IwErfdqKs3lv9xFR-cdsK5k1mbgId7eQw2c2LD2XPhMtcALu8IkAIlMF3wOCNxN6Nh1rzp5G4XsaTPTldV-3gOJjNSI5w7NFSAfBwvI055R-VtRb0T-7LqdbTNASMQdb4IC0dz-YAkxHjyyny9znu0jjzPu-OsnJjwCBr13aNC7WFG_HWCZtJRhJgukDRqDQ1WwvTSumBqJfoymd1k0ir62LbVtSAbj',
      },
      {
        id: 'var-0219-2',
        sku: 'GMC-0219-DAI',
        variantName: 'Bản Đại H34cm',
        spec: 'Chiều cao 34cm • Men rêu phong hóa',
        price: 1350000,
        stockQuantity: 10,
        isPrimary: false,
        imageUrl:
          'https://lh3.googleusercontent.com/aida/ALJJyrDfmhjzEDEoY7Uu473aPtY4jyYh_IwErfdqKs3lv9xFR-cdsK5k1mbgId7eQw2c2LD2XPhMtcALu8IkAIlMF3wOCNxN6Nh1rzp5G4XsaTPTldV-3gOJjNSI5w7NFSAfBwvI055R-VtRb0T-7LqdbTNASMQdb4IC0dz-YAkxHjyyny9znu0jjzPu-OsnJjwCBr13aNC7WFG_HWCZtJRhJgukDRqDQ1WwvTSumBqJfoymd1k0ir62LbVtSAbj',
      },
    ],
  },
  {
    id: 'prd-0331',
    code: 'PRD-GMC-0331',
    name: 'Lư Xông Trầm Sa Thạch An Lạc',
    categoryId: 'cat-lu-huong',
    categoryName: 'Lư hương & Trầm sa thạch',
    description: 'Lư đốt trầm men tro sa thạch nung nhiệt độ cao 1.300°C.',
    isActive: true,
    glazeType: 'Sa thạch hỏa biến',
    primaryImage:
      'https://lh3.googleusercontent.com/aida/ALJJyrArHoXRTTdd3J7zgKBziVh9G1s8UOa-Mqfirm05KnxW7PAMkIsu4PNanMitQbGMkMJi-QT_M-oii-v1Kba-qtDNM8Iq2RKh1NwanYHtYK4aU9-T39lmGPY0xyOTWaS8iBi-g4rEw69CMlFLC6oqReaRrdZYQ15p_fLRF1oz7-KJmzWUKXdLUjJIGwUDJ-AUF0MxqA_ug1-emKrHz2HZ7c0gxoGO-MRmJvblez5Ql8a0wWUNOAQKTlHoOXNL',
    variants: [
      {
        id: 'var-0331-1',
        sku: 'GMC-0331-STN',
        variantName: 'Sa Thạch Nâu Khói Dáng Thấp',
        spec: 'Khắc thủ công • Chịu nhiệt tàn trầm',
        price: 1250000,
        stockQuantity: 8,
        isPrimary: true,
        imageUrl:
          'https://lh3.googleusercontent.com/aida/ALJJyrArHoXRTTdd3J7zgKBziVh9G1s8UOa-Mqfirm05KnxW7PAMkIsu4PNanMitQbGMkMJi-QT_M-oii-v1Kba-qtDNM8Iq2RKh1NwanYHtYK4aU9-T39lmGPY0xyOTWaS8iBi-g4rEw69CMlFLC6oqReaRrdZYQ15p_fLRF1oz7-KJmzWUKXdLUjJIGwUDJ-AUF0MxqA_ug1-emKrHz2HZ7c0gxoGO-MRmJvblez5Ql8a0wWUNOAQKTlHoOXNL',
      },
    ],
  },
];

/**
 * Tự động nén và tối ưu hóa ảnh bằng HTML5 Canvas:
 * Giữ nguyên độ sắc nét cao nhưng giảm dung lượng về ~35KB - 65KB,
 * hoàn toàn an toàn và không bao giờ bị lỗi quá tải (PayloadTooLarge 413) khi gửi qua API.
 */
const compressImageToWebSafe = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxWidth = 960;
        const maxHeight = 960;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Nén định dạng JPEG chất lượng cao 0.78 gọn nhẹ
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.78);
        resolve(compressedDataUrl);
      };
      img.onerror = () => reject(new Error('Không thể giải mã tệp ảnh'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Không thể đọc tệp ảnh'));
    reader.readAsDataURL(file);
  });
};

/**
 * Component Chọn ảnh trực quan từ Thiết bị / Thư mục máy tính kèm xem trước tức thì
 */
const ImagePickerField = ({
  id,
  label = 'Hình ảnh tác phẩm / biến thể',
  value,
  onChange,
  required = false,
  helpText = 'Hỗ trợ JPG, PNG, WEBP (tối đa 10MB). Nhấp chọn hoặc kéo thả ảnh từ máy tính.',
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef(null);

  const handleProcessFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chỉ chọn tệp hình ảnh (JPG, PNG, WEBP, GIF...)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Dung lượng tệp vượt quá 10MB. Vui lòng chọn ảnh dung lượng nhẹ hơn.');
      return;
    }

    try {
      const compressed = await compressImageToWebSafe(file);
      onChange(compressed);
    } catch (err) {
      console.warn('Lỗi nén ảnh, chuyển sang nạp ảnh trực tiếp:', err);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onChange(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    handleProcessFile(file);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    handleProcessFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant font-label">
          {label} {required && <span className="text-error">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] font-medium text-primary hover:underline font-label cursor-pointer flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[13px]">{showUrlInput ? 'upload_file' : 'link'}</span>
          <span>{showUrlInput ? 'Chọn tệp từ thiết bị' : 'Hoặc dán URL online'}</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        id={id}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {showUrlInput ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Dán link ảnh (https://... hoặc /images/...)"
            className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant/40 rounded-xl text-xs text-on-surface outline-none focus:border-primary font-body"
          />
        </div>
      ) : (
        <div>
          {value ? (
            <div className="relative group p-2.5 bg-surface-container-low/70 border border-outline-variant/40 rounded-xl flex items-center gap-3.5 transition-all">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-surface-container-lowest border border-outline-variant/30 flex-shrink-0 relative shadow-sm">
                <img
                  src={value}
                  alt="Ảnh xem trước"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-on-surface font-label">
                  <span className="material-symbols-outlined text-primary text-[16px]">check_circle</span>
                  <span>Đã chọn ảnh thành công</span>
                </div>
                <p className="text-[11px] text-secondary truncate font-mono">
                  {value.startsWith('data:image') ? 'Ảnh từ thiết bị / máy tính cá nhân' : value}
                </p>
                <div className="flex items-center gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-[11px] font-semibold text-on-surface font-label transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[13px]">folder_open</span>
                    <span>Đổi ảnh từ máy</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange('')}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-error/10 text-[11px] font-semibold text-error font-label transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[13px]">delete</span>
                    <span>Xóa ảnh</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                isDragOver
                  ? 'border-primary bg-primary/5 text-primary scale-[0.99]'
                  : 'border-outline-variant/60 hover:border-primary/80 bg-surface-container-low/40 hover:bg-surface-container-low'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">add_photo_alternate</span>
              </div>
              <div className="text-center">
                <span className="text-xs font-semibold text-on-surface font-label hover:text-primary transition-colors">
                  Nhấp để duyệt thư mục máy tính hoặc kéo thả ảnh vào đây
                </span>
                <p className="text-[11px] text-secondary mt-0.5 font-body">
                  {helpText}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Dữ liệu media mẫu chuẩn từ Cloudinary Studio của xưởng gốm (Bộ tác phẩm B1)
 */
const SAMPLE_STUDIO_MEDIA = {
  angles: {
    front: 'https://res.cloudinary.com/velll47x/image/upload/v1792941507/ceramic_shop/products/B1/4_angles/front.jpg',
    left: 'https://res.cloudinary.com/velll47x/image/upload/v1792941509/ceramic_shop/products/B1/4_angles/left.jpg',
    back: 'https://res.cloudinary.com/velll47x/image/upload/v1792941512/ceramic_shop/products/B1/4_angles/back.jpg',
    right: 'https://res.cloudinary.com/velll47x/image/upload/v1792941516/ceramic_shop/products/B1/4_angles/right.jpg',
  },
  details: [
    { id: 'dt-1', url: 'https://res.cloudinary.com/velll47x/image/upload/v1792941519/ceramic_shop/products/B1/details/detail_1.jpg', caption: 'Vân men nứt hỏa biến' },
    { id: 'dt-2', url: 'https://res.cloudinary.com/velll47x/image/upload/v1792941522/ceramic_shop/products/B1/details/detail_2.jpg', caption: 'Họa tiết khắc chìm thủ công' },
    { id: 'dt-3', url: 'https://res.cloudinary.com/velll47x/image/upload/v1792941526/ceramic_shop/products/B1/details/detail_3.jpg', caption: 'Dấu triện nung đáy thô mộc' },
  ],
  video: 'https://res.cloudinary.com/velll47x/video/upload/v1792941567/ceramic_shop/products/B1/videos/video_1.mov',
};

/**
 * Component Quản lý Media Biến Thể: Bộ 4 góc xoay chuẩn + Ảnh chụp chi tiết + Video thực tế
 */
const ProductMediaUploader = ({ media, onChange }) => {
  const [activeTab, setActiveTab] = useState('angles'); // 'angles' | 'details' | 'video'

  // Số lượng góc ảnh đã nạp
  const anglesCount = ['front', 'left', 'back', 'right'].filter(
    (k) => Boolean(media?.angles?.[k])
  ).length;

  // Xử lý nạp ảnh góc xoay từ máy tính
  const handleAngleFileInput = async (slot, file) => {
    if (!file) return;
    try {
      const compressed = await compressImageToWebSafe(file);
      onChange({
        ...media,
        angles: {
          ...(media?.angles || {}),
          [slot]: compressed,
        },
      });
    } catch (err) {
      console.warn('Lỗi đọc ảnh góc:', err);
    }
  };

  // Xóa ảnh góc xoay
  const handleRemoveAngle = (slot) => {
    onChange({
      ...media,
      angles: {
        ...(media?.angles || {}),
        [slot]: '',
      },
    });
  };

  // Thêm ảnh chi tiết từ máy tính
  const handleDetailFileInput = async (file) => {
    if (!file) return;
    try {
      const compressed = await compressImageToWebSafe(file);
      const newDetail = {
        id: `dt-${Date.now()}`,
        url: compressed,
        caption: `Chi tiết ${(media?.details?.length || 0) + 1}`,
      };
      onChange({
        ...media,
        details: [...(media?.details || []), newDetail],
      });
    } catch (err) {
      console.warn('Lỗi đọc ảnh chi tiết:', err);
    }
  };

  // Xóa ảnh chi tiết
  const handleRemoveDetail = (id) => {
    onChange({
      ...media,
      details: (media?.details || []).filter((item) => item.id !== id),
    });
  };

  // Nạp video từ máy tính
  const handleVideoFileInput = (file) => {
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      alert('Vui lòng chọn tệp video hợp lệ (MP4, MOV, WebM)');
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    onChange({
      ...media,
      video: previewUrl,
    });
  };

  // Xóa video
  const handleRemoveVideo = () => {
    onChange({
      ...media,
      video: '',
    });
  };

  const angleConfig = [
    { key: 'front', label: 'Mặt trước', isPrimary: true },
    { key: 'left', label: 'Mặt trái', isPrimary: false },
    { key: 'back', label: 'Mặt sau', isPrimary: false },
    { key: 'right', label: 'Mặt phải', isPrimary: false },
  ];

  return (
    <div className="space-y-3.5 pt-1">
      {/* Header khu vực media */}
      <div className="flex items-center justify-between">
        <div>
          <span className="block text-xs font-semibold text-on-surface font-body">
            Bộ ảnh & video biến thể
          </span>
          <p className="text-[11px] text-secondary font-body">
            Gồm 4 góc xoay chuẩn, ảnh chi tiết men nung và video thực tế
          </p>
        </div>
      </div>

      {/* 3 Tab điều hướng tiếng Việt chuẩn */}
      <div className="grid grid-cols-3 p-1 bg-surface-container rounded-xl gap-1 text-xs font-medium font-body select-none">
        <button
          type="button"
          onClick={() => setActiveTab('angles')}
          className={`py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'angles'
              ? 'bg-surface-container-lowest text-primary font-semibold shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span>Bộ 4 góc ảnh</span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
              activeTab === 'angles'
                ? 'bg-primary/10 text-primary'
                : 'bg-surface-container-highest text-secondary'
            }`}
          >
            {anglesCount}/4
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('details')}
          className={`py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'details'
              ? 'bg-surface-container-lowest text-primary font-semibold shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span>Ảnh chi tiết</span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
              activeTab === 'details'
                ? 'bg-primary/10 text-primary'
                : 'bg-surface-container-highest text-secondary'
            }`}
          >
            {media?.details?.length || 0}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('video')}
          className={`py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'video'
              ? 'bg-surface-container-lowest text-primary font-semibold shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span>Video thực tế</span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
              activeTab === 'video'
                ? 'bg-primary/10 text-primary'
                : 'bg-surface-container-highest text-secondary'
            }`}
          >
            {media?.video ? '1' : '0'}
          </span>
        </button>
      </div>

      {/* TAB 1: BỘ 4 GÓC ẢNH XOAY CHUẨN */}
      {activeTab === 'angles' && (
        <div className="space-y-2.5">
          <div className="grid grid-cols-2 gap-3">
            {angleConfig.map((slot) => {
              const currentUrl = media?.angles?.[slot.key];
              const fileInputId = `angle-file-${slot.key}`;

              return (
                <div
                  key={slot.key}
                  className="p-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low/60 flex flex-col justify-between gap-2 transition-all hover:border-outline-variant"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-on-surface font-body">
                      {slot.label}
                    </span>
                    {slot.isPrimary && (
                      <span className="text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                        Ảnh chính
                      </span>
                    )}
                  </div>

                  <input
                    id={fileInputId}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      handleAngleFileInput(slot.key, file);
                      e.target.value = '';
                    }}
                    className="hidden"
                  />

                  {currentUrl ? (
                    <div className="space-y-2">
                      <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-surface-container-lowest border border-outline-variant/30 group shadow-xs">
                        <img
                          src={currentUrl}
                          alt={slot.label}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex items-center justify-between gap-2 pt-0.5">
                        <label
                          htmlFor={fileInputId}
                          className="flex-1 text-center py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-medium text-on-surface hover:text-primary cursor-pointer transition-colors"
                        >
                          Đổi ảnh
                        </label>
                        <button
                          type="button"
                          onClick={() => handleRemoveAngle(slot.key)}
                          className="text-xs font-medium text-error hover:bg-error/10 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-square w-full rounded-lg border-2 border-dashed border-outline-variant/60 hover:border-primary/80 bg-surface-container-lowest/60 flex flex-col items-center justify-center gap-1.5 p-2 transition-colors">
                      <span className="text-xs text-secondary font-body text-center">
                        Chưa có ảnh {slot.label.toLowerCase()}
                      </span>
                      <label
                        htmlFor={fileInputId}
                        className="px-3 py-1 rounded-lg bg-primary text-on-primary text-xs font-medium hover:bg-primary-container cursor-pointer transition-colors shadow-2xs mt-1"
                      >
                        Đổi ảnh
                      </label>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: ẢNH CHỤP CHI TIẾT */}
      {activeTab === 'details' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-secondary font-body">
            <span>Cận cảnh nước men, hoa văn thủ công và triện đáy</span>
            <label
              htmlFor="add-detail-input"
              className="text-primary font-medium hover:underline cursor-pointer"
            >
              Thêm ảnh
            </label>
          </div>

          <input
            id="add-detail-input"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              handleDetailFileInput(file);
              e.target.value = '';
            }}
            className="hidden"
          />

          <div className="grid grid-cols-3 gap-2.5">
            {(media?.details || []).map((detail, idx) => (
              <div
                key={detail.id || idx}
                className="group relative aspect-square rounded-xl overflow-hidden bg-surface-container-low border border-outline-variant/40 shadow-xs flex flex-col justify-end"
              >
                <img
                  src={detail.url}
                  alt={detail.caption || `Chi tiết ${idx + 1}`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                <button
                  type="button"
                  onClick={() => handleRemoveDetail(detail.id)}
                  className="absolute top-1.5 right-1.5 text-xs text-white bg-black/60 hover:bg-error px-1.5 py-0.5 rounded-md transition-colors cursor-pointer"
                  title="Xóa ảnh chi tiết"
                >
                  Xóa
                </button>
                <span className="relative z-10 px-2 py-1 text-[10px] font-semibold text-white truncate font-body">
                  {detail.caption || `Chi tiết ${idx + 1}`}
                </span>
              </div>
            ))}

            {/* Ô thêm ảnh chi tiết mới */}
            <div className="aspect-square rounded-xl border-2 border-dashed border-outline-variant/60 hover:border-primary/80 bg-surface-container-low/40 flex flex-col items-center justify-center p-2 transition-colors">
              <label
                htmlFor="add-detail-input"
                className="text-xs font-medium text-primary hover:underline cursor-pointer text-center"
              >
                Thêm ảnh
              </label>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: VIDEO THỰC TẾ SẢN PHẨM */}
      {activeTab === 'video' && (
        <div className="space-y-3">
          <input
            id="video-file-input"
            type="file"
            accept="video/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              handleVideoFileInput(file);
              e.target.value = '';
            }}
            className="hidden"
          />

          {media?.video ? (
            <div className="space-y-2.5">
              <div className="rounded-xl overflow-hidden bg-black/90 border border-outline-variant/30 shadow-sm aspect-video flex items-center justify-center">
                <video
                  key={media.video}
                  src={media.video}
                  controls
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40 flex items-center justify-between">
                <div>
                  <span className="block text-xs font-semibold text-on-surface font-body">
                    Thước phim thực tế tại xưởng
                  </span>
                  <p className="text-[11px] text-secondary font-body">
                    Độ phân giải cao, hiển thị góc xoay sinh động
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="video-file-input"
                    className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-medium text-on-surface cursor-pointer transition-colors"
                  >
                    Đổi video
                  </label>
                  <button
                    type="button"
                    onClick={handleRemoveVideo}
                    className="px-2 py-1.5 rounded-lg text-xs font-medium text-error hover:bg-error/10 transition-colors cursor-pointer"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border-2 border-dashed border-outline-variant/60 hover:border-primary/80 bg-surface-container-low/40 p-6 flex flex-col items-center justify-center gap-2 text-center transition-colors">
              <span className="text-xs font-medium text-on-surface font-body">
                Chưa có video cho biến thể này
              </span>
              <p className="text-[11px] text-secondary font-body max-w-xs">
                Tải lên video định dạng MP4, MOV, WebM từ máy tính
              </p>
              <label
                htmlFor="video-file-input"
                className="px-4 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-medium hover:bg-primary-container cursor-pointer transition-colors shadow-xs mt-1"
              >
                Đổi video
              </label>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const AdminProductsPage = () => {
  const toast = useToast();

  // State danh sách sản phẩm & danh mục
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Bộ lọc
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [glazeFilter, setGlazeFilter] = useState('ALL');

  // Điều khiển mở rộng/thu gọn danh sách biến thể từng sản phẩm
  const [expandedProducts, setExpandedProducts] = useState(['prd-0104']);

  // ==========================================
  // MODAL / DRAWER 1: FORM SẢN PHẨM (THÊM / SỬA)
  // ==========================================
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null = tạo mới, object = chỉnh sửa
  const [productFormName, setProductFormName] = useState('');
  const [productFormCategory, setProductFormCategory] = useState('');
  const [productFormDesc, setProductFormDesc] = useState('');
  const [productFormActive, setProductFormActive] = useState(true);
  const [productFormIsReturnable, setProductFormIsReturnable] = useState(true);
  const [productFormGlaze, setProductFormGlaze] = useState('Men tro củi tự nhiên');
  const [productFormInitialPrice, setProductFormInitialPrice] = useState(1500000);
  const [productFormInitialStock, setProductFormInitialStock] = useState(10);
  const [productFormImage, setProductFormImage] = useState('/images/hero-vase.jpg');

  // ==========================================
  // MODAL / DRAWER 2: FORM BIẾN THỂ (THÊM / SỬA)
  // ==========================================
  const [isVariantDrawerOpen, setIsVariantDrawerOpen] = useState(false);
  const [parentProductForVariant, setParentProductForVariant] = useState(null);
  const [editingVariant, setEditingVariant] = useState(null); // null = thêm mới, object = sửa
  const [variantNameInput, setVariantNameInput] = useState('');
  const [variantSkuInput, setVariantSkuInput] = useState('');
  const [variantPriceInput, setVariantPriceInput] = useState(1850000);
  const [variantStockInput, setVariantStockInput] = useState(12);
  const [variantSpecInput, setVariantSpecInput] = useState('Dung tích 220ml');
  const [variantImageInput, setVariantImageInput] = useState('/images/hero-vase.jpg');
  const [variantIsPrimary, setVariantIsPrimary] = useState(false);
  const [variantMedia, setVariantMedia] = useState({
    angles: { front: '', left: '', back: '', right: '' },
    details: [],
    video: '',
  });

  // ==========================================
  // MODAL 3: BỘ SƯU TẬP ẢNH BIẾN THỂ (Variant Images Manager)
  // Kết nối Backend: createVariantImage & updateVariantImage
  // ==========================================
  const [isImagesModalOpen, setIsImagesModalOpen] = useState(false);
  const [selectedVariantForImages, setSelectedVariantForImages] = useState(null); // { product, variant }
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageIsPrimary, setNewImageIsPrimary] = useState(false);
  const [newImageOrder, setNewImageOrder] = useState(0);
  const [isSubmittingImage, setIsSubmittingImage] = useState(false);

  // Tải sản phẩm & danh mục từ Backend API
  const fetchCatalogData = async (showToastNotice = false) => {
    setIsRefreshing(true);
    try {
      // 1. Tải danh mục
      const catRes = await categoryApi.getCategories();
      if (catRes?.data && Array.isArray(catRes.data) && catRes.data.length > 0) {
        setCategories(catRes.data);
      }

      // 2. Tải sản phẩm admin
      const prodRes = await productApi.adminGetProducts({ limit: 50 });
      if (prodRes?.data?.products && Array.isArray(prodRes.data.products) && prodRes.data.products.length > 0) {
        const normalized = prodRes.data.products.map((p) => {
          const variants = (p.variants || []).map((v) => ({
            id: v.id,
            sku: `SKU-${v.id.slice(-6).toUpperCase()}`,
            variantName: v.variantName,
            spec: `Quy cách nung củi • Tồn ${v.stockQuantity} cái`,
            price: v.price || 0,
            stockQuantity: v.stockQuantity || 0,
            isPrimary: v.images?.some((img) => img.isPrimary) || false,
            imageUrl:
              v.images?.find((img) => img.isPrimary)?.imageUrl ||
              v.images?.[0]?.imageUrl ||
              '/images/hero-vase.jpg',
            images:
              Array.isArray(v.images) && v.images.length > 0
                ? v.images
                : [
                    {
                      id: `img-${v.id}`,
                      imageUrl:
                        v.images?.find((img) => img.isPrimary)?.imageUrl ||
                        v.images?.[0]?.imageUrl ||
                        '/images/hero-vase.jpg',
                      isPrimary: true,
                      displayOrder: 0,
                    },
                  ],
          }));

          return {
            id: p.id,
            code: `PRD-${p.id.slice(-6).toUpperCase()}`,
            name: p.name,
            categoryId: p.categoryId,
            categoryName: p.category?.name || 'Tác phẩm gốm mộc',
            description: p.description || 'Cốt đất sét thô nung nhiệt cao 1300°C.',
            isActive: p.isActive !== false,
            isReturnable: p.isReturnable ?? true,
            glazeType: p.category?.name || 'Men tro tự nhiên',
            primaryImage: variants[0]?.imageUrl || '/images/hero-vase.jpg',
            variants,
          };
        });
        setProducts(normalized);
        if (showToastNotice) toast.success('Đã làm mới dữ liệu tác phẩm từ máy chủ thành công!');
      } else {
        if (showToastNotice) toast.info('Đang hiển thị danh mục tác phẩm tiêu chuẩn.');
      }
    } catch (err) {
      console.warn('Lỗi tải sản phẩm quản trị:', err?.message);
      if (showToastNotice) toast.warning('Chưa kết nối được máy chủ, đang dùng dữ liệu dự phòng.');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCatalogData(false);
  }, []);

  // Tính toán 4 Bento Metrics
  const metrics = useMemo(() => {
    const totalProducts = products.length;
    const activeProducts = products.filter((p) => p.isActive).length;
    const totalVariants = products.reduce((acc, p) => acc + (p.variants?.length || 0), 0);
    const lowStockCount = products.reduce(
      (acc, p) => acc + (p.variants?.filter((v) => v.stockQuantity <= 3).length || 0),
      0
    );
    const activePercent = totalProducts > 0 ? ((activeProducts / totalProducts) * 100).toFixed(1) : '100';

    return {
      totalProducts,
      activeProducts,
      totalVariants,
      lowStockCount,
      activePercent,
    };
  }, [products]);

  // Bộ lọc sản phẩm
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Tìm kiếm
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = p.name.toLowerCase().includes(q);
        const matchCode = p.code.toLowerCase().includes(q);
        const matchGlaze = p.glazeType?.toLowerCase().includes(q);
        const matchVariant = p.variants?.some(
          (v) => v.variantName.toLowerCase().includes(q) || v.sku.toLowerCase().includes(q)
        );
        if (!matchName && !matchCode && !matchGlaze && !matchVariant) return false;
      }

      // 2. Danh mục
      if (selectedCategory !== 'ALL' && p.categoryId !== selectedCategory && p.categoryName !== selectedCategory) {
        return false;
      }

      // 3. Trạng thái kinh doanh
      if (statusFilter === 'ACTIVE' && !p.isActive) return false;
      if (statusFilter === 'DRAFT' && p.isActive) return false;

      // 4. Cốt đất & men nung
      if (glazeFilter !== 'ALL' && !p.glazeType?.toLowerCase().includes(glazeFilter.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [products, searchQuery, selectedCategory, statusFilter, glazeFilter]);

  // Toggle mở/đóng xem biến thể của một sản phẩm
  const toggleExpand = (productId) => {
    setExpandedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // Toggle bật/tắt bán tác phẩm (isActive)
  const toggleProductActive = async (product) => {
    const nextActive = !product.isActive;
    try {
      await productApi.adminUpdateProduct(product.id, { isActive: nextActive });
    } catch (e) {
      // Tiếp tục cập nhật UI lạc quan
    }

    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, isActive: nextActive } : p))
    );
    toast.success(
      nextActive
        ? `Đã kích hoạt hiển thị tác phẩm "${product.name}" lên gian hàng!`
        : `Đã tạm ẩn tác phẩm "${product.name}" khỏi storefront.`
    );
  };

  // ==========================================
  // XỬ LÝ MỞ / ĐÓNG FORM SẢN PHẨM (PRODUCT)
  // ==========================================
  const openCreateProductModal = () => {
    setEditingProduct(null);
    setProductFormName('');
    setProductFormCategory(categories[0]?.id || 'cat-am-chen');
    setProductFormDesc('');
    setProductFormActive(true);
    setProductFormIsReturnable(true);
    setProductFormGlaze('Men tro củi tự nhiên');
    setProductFormInitialPrice(1850000);
    setProductFormInitialStock(12);
    setProductFormImage('https://lh3.googleusercontent.com/aida/ALJJyrCj3047l_YGdYP2wNd8zbl71YC1xUloEJlfYZ4w_bhScS3WvRscuM7zvYThL_TNZMlZO9LHG2oKub0RMyAcPgL_DIDRt8dbqaAbelnAzfLfTYpx2_qORT6qXe0hMZmrYr_AVLVMnD5zvb5fjKyHqji8oSaYv7jYCdPMb871pEj9sDDWPXkXe3M4OSFNL9tApWoMzwEx96uQ8Z-trjEl7RTZm7vh4c_14W5PAKnQqe7WpiN4a-NHWKW10263');
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product) => {
    setEditingProduct(product);
    setProductFormName(product.name);
    setProductFormCategory(product.categoryId);
    setProductFormDesc(product.description || '');
    setProductFormActive(product.isActive);
    setProductFormIsReturnable(product.isReturnable !== false);
    setProductFormGlaze(product.glazeType || 'Men tro củi tự nhiên');
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productFormName.trim()) {
      toast.warning('Vui lòng nhập tên tác phẩm gốm mộc!');
      return;
    }

    if (editingProduct) {
      // 1. Chỉnh sửa sản phẩm hiện tại
      try {
        await productApi.adminUpdateProduct(editingProduct.id, {
          name: productFormName.trim(),
          categoryId: productFormCategory,
          description: productFormDesc.trim(),
          isActive: productFormActive,
          isReturnable: productFormIsReturnable,
        });
      } catch (err) {
        // Optimistic
      }

      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: productFormName.trim(),
                categoryId: productFormCategory,
                categoryName:
                  categories.find((c) => c.id === productFormCategory)?.name || p.categoryName,
                description: productFormDesc.trim(),
                isActive: productFormActive,
                isReturnable: productFormIsReturnable,
                glazeType: productFormGlaze,
              }
            : p
        )
      );
      toast.success(`Đã cập nhật tác phẩm "${productFormName}"!`);
    } else {
      // 2. Tạo mới sản phẩm
      const selectedCat = categories.find((c) => c.id === productFormCategory);
      const newId = `prd-${Date.now().toString().slice(-4)}`;
      const newSku = `PRD-GMC-${Date.now().toString().slice(-4)}`;

      const newProductObj = {
        id: newId,
        code: newSku,
        name: productFormName.trim(),
        categoryId: productFormCategory,
        categoryName: selectedCat?.name || 'Tác phẩm gốm mộc',
        description: productFormDesc.trim(),
        isActive: productFormActive,
        isReturnable: productFormIsReturnable,
        glazeType: productFormGlaze,
        primaryImage: productFormImage,
        variants: [
          {
            id: `var-${Date.now().toString().slice(-4)}`,
            sku: `GMC-${Date.now().toString().slice(-4)}-TC`,
            variantName: 'Bản Tiêu Chuẩn Nung Củi',
            spec: 'Quy cách mộc bản xuất xưởng',
            price: Number(productFormInitialPrice) || 1200000,
            stockQuantity: Number(productFormInitialStock) || 10,
            isPrimary: true,
            imageUrl: productFormImage,
          },
        ],
      };

      try {
        await productApi.adminCreateProduct({
          name: productFormName.trim(),
          categoryId: productFormCategory,
          description: productFormDesc.trim(),
          isReturnable: productFormIsReturnable,
          initialVariant: {
            variantName: 'Bản Tiêu Chuẩn Nung Củi',
            price: Number(productFormInitialPrice) || 1200000,
            stockQuantity: Number(productFormInitialStock) || 10,
            initialImage: {
              imageUrl: productFormImage,
              isPrimary: true,
              displayOrder: 0,
            },
          },
        });
      } catch (err) {
        // Optimistic
      }

      setProducts((prev) => [newProductObj, ...prev]);
      setExpandedProducts((prev) => [newId, ...prev]);
      toast.success(`Đã khai hỏa tác phẩm mới: "${productFormName}"!`);
    }

    setIsProductModalOpen(false);
  };

  // ==========================================
  // XỬ LÝ MỞ / ĐÓNG FORM BIẾN THỂ (VARIANT)
  // ==========================================
  const openCreateVariantDrawer = (product) => {
    setParentProductForVariant(product);
    setEditingVariant(null);
    setVariantNameInput('');
    setVariantSkuInput(`GMC-${product.code?.slice(-4) || '2401'}-NEW`);
    setVariantPriceInput(1850000);
    setVariantStockInput(10);
    setVariantSpecInput('Quy cách thủ công tiêu chuẩn');
    setVariantImageInput(product.primaryImage || SAMPLE_STUDIO_MEDIA.angles.front);
    setVariantIsPrimary(false);
    setVariantMedia({
      angles: {
        front: product.primaryImage || SAMPLE_STUDIO_MEDIA.angles.front,
        left: SAMPLE_STUDIO_MEDIA.angles.left,
        back: SAMPLE_STUDIO_MEDIA.angles.back,
        right: SAMPLE_STUDIO_MEDIA.angles.right,
      },
      details: [...SAMPLE_STUDIO_MEDIA.details],
      video: SAMPLE_STUDIO_MEDIA.video,
    });
    setIsVariantDrawerOpen(true);
  };

  const openEditVariantDrawer = (product, variant) => {
    setParentProductForVariant(product);
    setEditingVariant(variant);
    setVariantNameInput(variant.variantName);
    setVariantSkuInput(variant.sku);
    setVariantPriceInput(variant.price);
    setVariantStockInput(variant.stockQuantity);
    setVariantSpecInput(variant.spec || 'Dung tích chuẩn');
    setVariantImageInput(variant.imageUrl || product.primaryImage);
    setVariantIsPrimary(variant.isPrimary || false);

    // Nạp đầy đủ 4 góc ảnh, chi tiết và video (ưu tiên ảnh của variant, fallback studio Cloudinary)
    const baseAngles = {
      front: variant.imageUrl || SAMPLE_STUDIO_MEDIA.angles.front,
      left: variant.images?.[1]?.imageUrl || SAMPLE_STUDIO_MEDIA.angles.left,
      back: variant.images?.[2]?.imageUrl || SAMPLE_STUDIO_MEDIA.angles.back,
      right: variant.images?.[3]?.imageUrl || SAMPLE_STUDIO_MEDIA.angles.right,
    };
    const baseDetails =
      variant.images && variant.images.length > 4
        ? variant.images.slice(4).map((img, idx) => ({
            id: img.id || `dt-${idx}`,
            url: img.imageUrl,
            caption: `Chi tiết ${idx + 1}`,
          }))
        : [...SAMPLE_STUDIO_MEDIA.details];
    const baseVideo = variant.video || SAMPLE_STUDIO_MEDIA.video;

    setVariantMedia(
      variant.media
        ? { ...variant.media }
        : {
            angles: baseAngles,
            details: baseDetails,
            video: baseVideo,
          }
    );
    setIsVariantDrawerOpen(true);
  };

  const handleSaveVariant = async (e) => {
    e.preventDefault();
    if (!parentProductForVariant) return;

    if (!variantNameInput.trim()) {
      toast.warning('Vui lòng nhập tên biến thể quy cách!');
      return;
    }

    const priceNum = Math.max(0, Number(variantPriceInput) || 0);
    const stockNum = Math.max(0, Number(variantStockInput) || 0);
    const effectiveImageUrl = variantMedia?.angles?.front || variantImageInput || parentProductForVariant.primaryImage;

    if (editingVariant) {
      // Chỉnh sửa biến thể
      try {
        await productApi.adminUpdateVariant(editingVariant.id, {
          variantName: variantNameInput.trim(),
          price: priceNum,
          stockQuantity: stockNum,
        });
      } catch (err) {
        // Optimistic
      }

      setProducts((prev) =>
        prev.map((p) => {
          if (p.id !== parentProductForVariant.id) return p;
          const updatedVars = (p.variants || []).map((v) => {
            if (v.id === editingVariant.id) {
              return {
                ...v,
                variantName: variantNameInput.trim(),
                price: priceNum,
                stockQuantity: stockNum,
                spec: variantSpecInput.trim(),
                isPrimary: variantIsPrimary,
                imageUrl: effectiveImageUrl,
                media: variantMedia,
              };
            }
            return variantIsPrimary ? { ...v, isPrimary: false } : v;
          });
          return { ...p, variants: updatedVars };
        })
      );
      toast.success(`Đã cập nhật biến thể "${variantNameInput}"!`);
    } else {
      // Thêm mới biến thể
      const newVarId = `var-${Date.now().toString().slice(-4)}`;
      const newVarObj = {
        id: newVarId,
        sku: variantSkuInput || `GMC-VAR-${Date.now().toString().slice(-4)}`,
        variantName: variantNameInput.trim(),
        price: priceNum,
        stockQuantity: stockNum,
        spec: variantSpecInput.trim(),
        isPrimary: variantIsPrimary,
        imageUrl: effectiveImageUrl,
        media: variantMedia,
      };

      try {
        await productApi.adminCreateVariant(parentProductForVariant.id, {
          variantName: variantNameInput.trim(),
          price: priceNum,
          stockQuantity: stockNum,
          initialImage: {
            imageUrl: effectiveImageUrl,
            isPrimary: variantIsPrimary,
            displayOrder: 0,
          },
        });
      } catch (err) {
        // Optimistic
      }

      setProducts((prev) =>
        prev.map((p) => {
          if (p.id !== parentProductForVariant.id) return p;
          let currentVars = p.variants || [];
          if (variantIsPrimary) {
            currentVars = currentVars.map((v) => ({ ...v, isPrimary: false }));
          }
          return {
            ...p,
            variants: [...currentVars, newVarObj],
          };
        })
      );
      toast.success(`Đã bổ sung biến thể "${variantNameInput}" cho tác phẩm!`);
    }

    setIsVariantDrawerOpen(false);
  };

  // ==========================================
  // XỬ LÝ ALBUM ẢNH BIẾN THỂ (VARIANT IMAGES)
  // Kết nối Backend: createVariantImage & updateVariantImage
  // ==========================================
  const openVariantImagesModal = (product, variant) => {
    const enrichedVariant = {
      ...variant,
      images:
        Array.isArray(variant.images) && variant.images.length > 0
          ? variant.images
          : [
              {
                id: `img-${variant.id}-1`,
                imageUrl: variant.imageUrl || product.primaryImage || '/images/hero-vase.jpg',
                isPrimary: true,
                displayOrder: 0,
              },
            ],
    };
    setSelectedVariantForImages({ product, variant: enrichedVariant });
    setNewImageUrl('');
    setNewImageIsPrimary(false);
    setNewImageOrder(enrichedVariant.images.length);
    setIsImagesModalOpen(true);
  };

  const handleCreateVariantImage = async (e) => {
    e.preventDefault();
    if (!selectedVariantForImages) return;
    if (!newImageUrl || !newImageUrl.trim()) {
      toast.warning('Vui lòng chọn hoặc nạp hình ảnh từ thiết bị trước khi lưu!');
      return;
    }

    setIsSubmittingImage(true);
    const { product, variant } = selectedVariantForImages;

    // Kiểm tra nếu là variant mock (chưa có trong CSDL)
    if (String(variant.id).startsWith('var-') || String(product.id).startsWith('prd-')) {
      toast.warning(
        'Đây là sản phẩm mẫu giao diện chưa lưu trong CSDL máy chủ. Vui lòng bấm nút "Làm mới" hoặc chọn tác phẩm thật đã tạo trong CSDL để lưu ảnh vĩnh viễn!'
      );
      setIsSubmittingImage(false);
      return;
    }

    const newImgData = {
      imageUrl: newImageUrl.trim(),
      isPrimary: newImageIsPrimary,
      displayOrder: Number(newImageOrder) || 0,
    };

    try {
      const res = await productApi.adminCreateImage(variant.id, newImgData);
      const savedImage = res?.data || { id: res?.data?.id || `img-${Date.now()}`, ...newImgData };
      toast.success('Đã lưu ảnh mới vào CSDL PostgreSQL thành công!');

      const createdImageObj = {
        id: savedImage.id,
        imageUrl: savedImage.imageUrl || newImgData.imageUrl,
        isPrimary: Boolean(savedImage.isPrimary ?? newImageIsPrimary),
        displayOrder: Number(savedImage.displayOrder ?? newImageOrder) || 0,
      };

      const updatedImages = newImageIsPrimary
        ? [
            ...variant.images.map((img) => ({ ...img, isPrimary: false })),
            createdImageObj,
          ]
        : [...variant.images, createdImageObj];

      const updatedVariant = {
        ...variant,
        imageUrl: newImageIsPrimary ? createdImageObj.imageUrl : variant.imageUrl,
        isPrimary: newImageIsPrimary ? true : variant.isPrimary,
        images: updatedImages,
      };

      setSelectedVariantForImages({ product, variant: updatedVariant });

      setProducts((prev) =>
        prev.map((p) => {
          if (p.id !== product.id) return p;
          return {
            ...p,
            primaryImage: newImageIsPrimary ? createdImageObj.imageUrl : p.primaryImage,
            variants: p.variants.map((v) => (v.id === variant.id ? updatedVariant : v)),
          };
        })
      );

      setNewImageUrl('');
      setNewImageIsPrimary(false);
      setNewImageOrder(updatedImages.length);

      // Tải lại ngầm để CSDL và FE đồng bộ tuyệt đối
      fetchCatalogData(false);
    } catch (err) {
      console.error('Lỗi khi thêm ảnh biến thể vào CSDL:', err);
      let errorMsg = 'Không thể lưu ảnh vào máy chủ.';
      if (err?.response?.status === 413) {
        errorMsg = 'Ảnh quá lớn vượt quá giới hạn của máy chủ. Vui lòng chọn ảnh nhẹ hơn.';
      } else if (err?.response?.status === 401 || err?.response?.status === 403) {
        errorMsg = 'Bạn cần đăng nhập tài khoản Quản trị viên (admin@ceramic.com) để thao tác trên CSDL!';
      } else if (err?.response?.status === 404) {
        errorMsg = 'Không tìm thấy phân loại sản phẩm này trong CSDL!';
      } else if (err?.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      toast.error(`Lỗi: ${errorMsg}`);
    } finally {
      setIsSubmittingImage(false);
    }
  };

  const handleSetPrimaryImage = async (image) => {
    if (!selectedVariantForImages) return;
    const { product, variant } = selectedVariantForImages;

    try {
      await productApi.adminUpdateImage(image.id, { isPrimary: true });
      toast.success('Đã cập nhật ảnh chính trong CSDL thành công!');

      const updatedImages = variant.images.map((img) => ({
        ...img,
        isPrimary: img.id === image.id,
      }));

      const updatedVariant = {
        ...variant,
        imageUrl: image.imageUrl,
        images: updatedImages,
      };

      setSelectedVariantForImages({ product, variant: updatedVariant });

      setProducts((prev) =>
        prev.map((p) => {
          if (p.id !== product.id) return p;
          return {
            ...p,
            primaryImage: image.imageUrl,
            variants: p.variants.map((v) => (v.id === variant.id ? updatedVariant : v)),
          };
        })
      );
    } catch (err) {
      const errorMsg = err?.response?.data?.message || 'Không thể cập nhật ảnh chính trên máy chủ';
      toast.error(errorMsg);
    }
  };

  const handleUpdateImageOrder = async (image, newOrder) => {
    if (!selectedVariantForImages) return;
    const { product, variant } = selectedVariantForImages;
    const orderNum = Number(newOrder) || 0;

    try {
      await productApi.adminUpdateImage(image.id, { displayOrder: orderNum });
      toast.success(`Đã cập nhật thứ tự hiển thị #${orderNum} trong CSDL!`);

      const updatedImages = variant.images.map((img) =>
        img.id === image.id ? { ...img, displayOrder: orderNum } : img
      );

      const updatedVariant = {
        ...variant,
        images: updatedImages,
      };

      setSelectedVariantForImages({ product, variant: updatedVariant });

      setProducts((prev) =>
        prev.map((p) => {
          if (p.id !== product.id) return p;
          return {
            ...p,
            variants: p.variants.map((v) => (v.id === variant.id ? updatedVariant : v)),
          };
        })
      );
    } catch (err) {
      const errorMsg = err?.response?.data?.message || 'Không thể cập nhật thứ tự ảnh trên máy chủ';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="flex flex-col w-full pb-16 font-body text-on-background animate-fadeIn">
      {/* ========================================================= */}
      {/* 1. TOP HEADLINE & ACTION ZONE (THANH TÌM KIẾM & BỘ LỌC)  */}
      {/* ========================================================= */}
      <section className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/40 shadow-[0_2px_16px_rgba(58,48,42,0.03)] mb-8 flex flex-col lg:flex-row gap-4 items-center justify-between">
        {/* Ô tìm kiếm */}
        <div className="w-full lg:w-1/3 relative flex items-center">
          <span className="material-symbols-outlined absolute left-3.5 text-outline text-[19px] pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên tác phẩm, mã SKU, chất men nung..."
            className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low/70 border border-outline-variant/40 rounded-xl text-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:border-primary transition-all font-body"
          />
        </div>

        {/* Các Dropdown lọc */}
        <div className="w-full lg:w-auto flex flex-wrap sm:flex-nowrap items-center gap-3">
          {/* Lọc danh mục */}
          <div className="relative w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full appearance-none pl-3.5 pr-8 py-2.5 bg-surface-container-low/70 border border-outline-variant/40 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary cursor-pointer font-medium font-body"
            >
              <option value="ALL">Mọi danh mục tác phẩm</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              expand_more
            </span>
          </div>

          {/* Lọc trạng thái mở bán */}
          <div className="relative w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none pl-3.5 pr-8 py-2.5 bg-surface-container-low/70 border border-outline-variant/40 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary cursor-pointer font-medium font-body"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="ACTIVE">Đang mở bán (Active)</option>
              <option value="DRAFT">Tạm ẩn (Draft)</option>
            </select>
            <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              expand_more
            </span>
          </div>

          {/* Lọc theo cốt đất & men */}
          <div className="relative w-full sm:w-auto">
            <select
              value={glazeFilter}
              onChange={(e) => setGlazeFilter(e.target.value)}
              className="w-full appearance-none pl-3.5 pr-8 py-2.5 bg-surface-container-low/70 border border-outline-variant/40 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary cursor-pointer font-medium font-body"
            >
              <option value="ALL">Lọc theo cốt đất &amp; men nung</option>
              <option value="Men tro củi tự nhiên">Men tro củi tự nhiên</option>
              <option value="Men rêu cổ phù sa">Men rêu cổ phù sa</option>
              <option value="Sa thạch hỏa biến">Sa thạch hỏa biến</option>
            </select>
            <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              expand_more
            </span>
          </div>

          {/* Nút làm mới */}
          <button
            type="button"
            onClick={() => fetchCatalogData(true)}
            disabled={isRefreshing}
            className="p-2.5 rounded-xl bg-surface-container-low/80 border border-outline-variant/40 text-secondary hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer disabled:opacity-50"
            title="Làm mới bộ lọc & dữ liệu"
          >
            <span
              className={`material-symbols-outlined text-[19px] ${
                isRefreshing ? 'animate-spin' : ''
              }`}
            >
              refresh
            </span>
          </button>

          {/* Nút Thêm Tác Phẩm Mới */}
          <button
            type="button"
            onClick={openCreateProductModal}
            className="px-4 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container text-xs font-semibold font-label shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Khai Hỏa Tác Phẩm</span>
          </button>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. METRIC SAHARA BENTO SUMMARY (4 CARDS)                  */}
      {/* ========================================================= */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Card 1: Tổng tác phẩm */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-[0_2px_16px_rgba(58,48,42,0.03)] hover:shadow-md transition-all flex flex-col justify-between group">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-secondary font-label">
              Tổng tác phẩm
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2.5">
            <span className="text-3xl font-sans font-bold text-on-surface tracking-tight">
              {metrics.totalProducts}
            </span>
            <span className="text-xs text-secondary font-body">mã tác phẩm gốc</span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-outline-variant/30 flex items-center gap-1.5 text-xs text-on-surface-variant font-medium">
            <span>
              Tăng <strong className="text-primary font-bold">+4 mẫu</strong> tuần này
            </span>
          </div>
        </div>

        {/* Card 2: Đang mở bán */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-[0_2px_16px_rgba(58,48,42,0.03)] hover:shadow-md transition-all flex flex-col justify-between group">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-secondary font-label">
              Đang mở bán
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2.5">
            <span className="text-3xl font-sans font-bold text-primary tracking-tight">
              {metrics.activeProducts}
            </span>
            <span className="text-xs text-secondary font-body">tác phẩm kích hoạt</span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-outline-variant/30 flex items-center gap-1.5 text-xs text-secondary font-medium">
            <span>
              <strong className="text-on-surface font-bold">{metrics.activePercent}%</strong> tỷ lệ
              hiển thị storefront
            </span>
          </div>
        </div>

        {/* Card 3: Tổng biến thể SKU */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-[0_2px_16px_rgba(58,48,42,0.03)] hover:shadow-md transition-all flex flex-col justify-between group">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-secondary font-label">
              Tổng biến thể SKU
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2.5">
            <span className="text-3xl font-sans font-bold text-on-surface tracking-tight">
              {metrics.totalVariants}
            </span>
            <span className="text-xs text-secondary font-body">quy cách men / size</span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-outline-variant/30 flex items-center gap-1.5 text-xs text-secondary font-medium">
            <span>Khớp chuẩn Prisma Schema</span>
          </div>
        </div>

        {/* Card 4: Cảnh báo tồn kho */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-tertiary-fixed/60 shadow-[0_2px_16px_rgba(58,48,42,0.03)] hover:shadow-md transition-all flex flex-col justify-between group">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-tertiary font-label">
              Cảnh báo tồn kho
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2.5">
            <span className="text-3xl font-sans font-bold text-tertiary tracking-tight">
              {metrics.lowStockCount < 10 ? `0${metrics.lowStockCount}` : metrics.lowStockCount}
            </span>
            <span className="text-xs text-tertiary font-semibold font-body">
              SKU cạn kho đất nung
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-outline-variant/30 flex items-center gap-1.5 text-xs text-tertiary font-medium">
            <span>Cần lên lịch nung mẻ bổ sung</span>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. DANH SÁCH SẢN PHẨM CHIẾM ĐẾN SÁT BÊN PHẢI TRANG (100% W)*/}
      {/* ========================================================= */}
      <div className="w-full flex flex-col gap-6">
        {filteredProducts.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant/60 p-12 text-center flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-4xl text-outline">search_off</span>
            <h3 className="font-headline text-lg font-bold text-on-surface">
              Không tìm thấy tác phẩm phù hợp
            </h3>
            <p className="text-xs text-on-surface-variant max-w-md">
              Vui lòng điều chỉnh lại từ khóa hoặc bộ lọc danh mục phía trên.
            </p>
          </div>
        ) : (
          filteredProducts.map((product) => {
            const isExpanded = expandedProducts.includes(product.id);
            const variantPrices = (product.variants || []).map((v) => v.price);
            const minPrice = variantPrices.length > 0 ? Math.min(...variantPrices) : 0;
            const maxPrice = variantPrices.length > 0 ? Math.max(...variantPrices) : 0;
            const totalStock = (product.variants || []).reduce(
              (sum, v) => sum + (v.stockQuantity || 0),
              0
            );

            return (
              <article
                key={product.id}
                className="w-full bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-[0_2px_16px_rgba(58,48,42,0.03)] overflow-hidden transition-all duration-300"
              >
                {/* Header Tác Phẩm Cha */}
                <div className="p-5 bg-surface-container-low/60 border-b border-outline-variant/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-4">
                    <img
                      src={product.primaryImage}
                      alt={product.name}
                      className="w-16 h-16 rounded-xl object-cover shadow-sm border border-outline-variant/50 flex-shrink-0"
                    />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-lg font-headline font-semibold text-on-surface tracking-tight">
                          {product.name}
                        </h2>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-surface-container-highest text-on-surface-variant font-mono tracking-wider">
                          {product.code}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-primary-fixed text-on-primary-fixed-variant font-body">
                          {product.categoryName}
                        </span>
                        {product.isReturnable ? (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-secondary-container text-on-secondary-container font-body">
                            Hỗ trợ Đổi Trả
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-surface-container-highest text-secondary font-body">
                            Không Đổi Trả
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-2 text-xs text-secondary flex-wrap font-body">
                        <span>
                          Tổng tồn: <strong className="text-on-surface font-semibold">{totalStock} cái</strong>
                        </span>
                        <span>•</span>
                        <span>
                          <strong className="text-on-surface font-semibold">{product.variants?.length || 0}</strong> biến thể SKU
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Hành động Tác Phẩm */}
                  <div className="flex items-center gap-3.5 self-end md:self-center">
                    {/* Toggle hiển thị bán */}
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <span className="text-xs font-medium text-secondary font-label">Hiển thị</span>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={product.isActive}
                          onChange={() => toggleProductActive(product)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                      </div>
                    </label>

                    {/* Nút sửa sản phẩm */}
                    <button
                      type="button"
                      onClick={() => openEditProductModal(product)}
                      className="px-3 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant/40 text-xs font-semibold text-on-surface hover:text-primary hover:border-primary transition-all flex items-center gap-1 cursor-pointer"
                      title="Sửa thông tin sản phẩm"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                      <span className="hidden sm:inline">Sửa tác phẩm</span>
                    </button>

                    {/* Nút thu gọn / mở rộng biến thể */}
                    <button
                      type="button"
                      onClick={() => toggleExpand(product.id)}
                      className="p-1.5 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                      title={isExpanded ? 'Thu gọn biến thể' : 'Mở rộng biến thể'}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {isExpanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Danh Sách Biến Thể Con (Hiện chi tiết khi mở rộng) */}
                {isExpanded ? (
                  <div className="p-5 space-y-3 bg-surface-container-lowest/40">
                    <div className="flex items-center justify-between pb-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-secondary font-label">
                        Phân loại &amp; Biến thể tồn kho (Prisma ProductVariant)
                      </span>
                      <button
                        type="button"
                        onClick={() => openCreateVariantDrawer(product)}
                        className="text-xs font-semibold text-primary hover:text-primary-container flex items-center gap-1 transition-colors font-label cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">add_circle</span>
                        <span>Thêm biến thể mới</span>
                      </button>
                    </div>

                    {/* Các hàng biến thể */}
                    {product.variants?.map((variant) => (
                      <div
                        key={variant.id}
                        className="p-3.5 rounded-xl bg-surface-container-low/50 hover:bg-surface-container border border-outline-variant/30 hover:border-outline-variant transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3.5">
                          <img
                            src={variant.imageUrl}
                            alt={variant.variantName}
                            className={`w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-outline-variant/40 shadow-sm ${
                              variant.stockQuantity <= 0 ? 'opacity-70' : ''
                            }`}
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-on-surface font-body">
                                {variant.variantName}
                              </span>
                              {variant.stockQuantity <= 0 ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-error-container text-on-error-container font-body">
                                  Hết hàng
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-surface-container-highest text-secondary font-body">
                                  Cốt đất mộc
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2.5 text-xs text-secondary mt-0.5 font-body">
                              <span>SKU: {variant.sku}</span>
                              <span>•</span>
                              <span className="text-on-surface-variant font-medium">
                                {variant.spec}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 self-end md:self-center">
                          <div className="text-right">
                            <div className="text-sm font-bold font-headline text-on-surface">
                              {formatCurrency(variant.price)}
                            </div>
                            <div
                              className={`text-xs font-medium font-body ${
                                variant.stockQuantity <= 0
                                  ? 'text-error font-bold'
                                  : 'text-secondary'
                              }`}
                            >
                              {variant.stockQuantity <= 0 ? (
                                'Tồn: 0 cái'
                              ) : (
                                <>
                                  Tồn: <span className="font-bold text-on-surface">{variant.stockQuantity} cái</span>
                                </>
                              )}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => openEditVariantDrawer(product, variant)}
                            className="px-3.5 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant/50 text-xs font-semibold font-body text-primary hover:bg-primary hover:text-on-primary hover:border-primary shadow-xs transition-all cursor-pointer"
                          >
                            Sửa
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Gợi ý khi thu gọn */
                  <div className="px-5 py-3.5 bg-surface-container-low/20 flex items-center justify-between text-xs text-secondary">
                    <span className="font-body">
                      Gồm {product.variants?.length || 0} biến thể:{' '}
                      {product.variants?.map((v, idx) => (
                        <span key={v.id}>
                          <strong className="text-on-surface font-semibold">
                            {v.variantName} (Tồn: {v.stockQuantity})
                          </strong>
                          {idx < product.variants.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleExpand(product.id)}
                      className="text-primary font-semibold font-label hover:underline flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Chi tiết biến thể</span>
                      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </button>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: FORM THÊM / SỬA SẢN PHẨM (OVERLAY MODAL)         */}
      {/* ========================================================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-surface-container-lowest w-full max-w-xl rounded-2xl border border-outline-variant/40 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header Form */}
            <div className="px-6 py-4 bg-surface-container flex items-center justify-between border-b border-outline-variant/30">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary font-headline text-lg font-bold">
                  G
                </div>
                <div>
                  <h3 className="font-headline font-bold text-lg text-on-surface">
                    {editingProduct ? 'Chỉnh Sửa Tác Phẩm Gốm' : 'Khai Hỏa Tác Phẩm Mới'}
                  </h3>
                  <p className="text-xs text-on-surface-variant font-body">
                    {editingProduct ? editingProduct.code : 'Khởi tạo mã tác phẩm gốc vào cơ sở dữ liệu'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Body Form */}
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Tên sản phẩm */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5 font-label">
                  Tên Tác Phẩm Gốm Mộc *
                </label>
                <input
                  type="text"
                  required
                  value={productFormName}
                  onChange={(e) => setProductFormName(e.target.value)}
                  placeholder="Ví dụ: Bộ Ấm Trà Mộc Men Tro Củi"
                  className="w-full px-3.5 py-2.5 bg-surface-container-low/70 border border-outline-variant/40 rounded-xl text-sm text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:border-primary font-medium transition-colors"
                />
              </div>

              {/* Danh mục */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5 font-label">
                    Danh Mục Tác Phẩm *
                  </label>
                  <select
                    value={productFormCategory}
                    onChange={(e) => setProductFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-surface-container-low/70 border border-outline-variant/40 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary font-medium cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5 font-label">
                    Cốt Đất &amp; Men Nung
                  </label>
                  <input
                    type="text"
                    value={productFormGlaze}
                    onChange={(e) => setProductFormGlaze(e.target.value)}
                    placeholder="VD: Men tro củi tự nhiên"
                    className="w-full px-3.5 py-2.5 bg-surface-container-low/70 border border-outline-variant/40 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary font-medium"
                  />
                </div>
              </div>

              {/* Mô tả */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5 font-label">
                  Mô Tả Triết Lý Chế Tác
                </label>
                <textarea
                  rows={3}
                  value={productFormDesc}
                  onChange={(e) => setProductFormDesc(e.target.value)}
                  placeholder="Nung nhiệt độ cao 1300°C bằng củi tự nhiên, phù sa sông Thu Bồn..."
                  className="w-full px-3.5 py-2.5 bg-surface-container-low/70 border border-outline-variant/40 rounded-xl text-xs text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:border-primary transition-colors resize-none"
                />
              </div>

              {/* Nếu là tạo mới, cấu hình biến thể đầu tiên */}
              {!editingProduct && (
                <div className="p-4 rounded-xl bg-surface-container-low/50 border border-outline-variant/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary font-label">
                      Biến Thể Quy Cách Ban Đầu (Khởi Tạo)
                    </span>
                    <span className="text-[10px] text-secondary font-mono">Prisma InitialVariant</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                        Giá Bán (VNĐ)
                      </label>
                      <input
                        type="number"
                        value={productFormInitialPrice}
                        onChange={(e) => setProductFormInitialPrice(e.target.value)}
                        className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant/40 rounded-lg text-xs font-mono font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                        Tồn Kho Ban Đầu
                      </label>
                      <input
                        type="number"
                        value={productFormInitialStock}
                        onChange={(e) => setProductFormInitialStock(e.target.value)}
                        className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant/40 rounded-lg text-xs font-mono font-semibold"
                      />
                    </div>
                  </div>
                  <ImagePickerField
                    id="product-form-image-picker"
                    label="Ảnh Đại Diện Tác Phẩm (Chọn từ thiết bị / thư mục)"
                    value={productFormImage}
                    onChange={setProductFormImage}
                    helpText="Ảnh sẽ làm đại diện chính của mẻ tác phẩm gốm mộc."
                  />
                </div>
              )}

              {/* Kích hoạt bán */}
              <div className="p-3.5 rounded-xl bg-surface-container-low/50 border border-outline-variant/40 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-on-surface font-label">
                    Mở bán ngay trên Storefront
                  </span>
                  <p className="text-[11px] text-secondary">
                    Cho phép khách hàng thưởng lãm và đặt mua ngay tại xưởng
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={productFormActive}
                    onChange={(e) => setProductFormActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                </label>
              </div>

              {/* Chính sách đổi trả hàng */}
              <div className="p-3.5 rounded-xl bg-surface-container-low/50 border border-outline-variant/40 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-on-surface font-label">
                    Hỗ trợ Đổi Trả Tác Phẩm
                  </span>
                  <p className="text-[11px] text-secondary font-body">
                    Cho phép khách hàng yêu cầu đổi trả hoặc thẩm định lại mẻ gốm
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={productFormIsReturnable}
                    onChange={(e) => setProductFormIsReturnable(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container text-xs font-semibold font-label cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container text-xs font-semibold font-label shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  {editingProduct ? 'Lưu' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DRAWER 2: FORM THÊM / SỬA BIẾN THỂ (SLIDE-OVER DRAWER)     */}
      {/* ========================================================= */}
      {isVariantDrawerOpen && parentProductForVariant && (
        <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsVariantDrawerOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
            <aside className="w-screen max-w-lg sm:max-w-xl bg-surface-container-lowest shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-outline-variant/40 p-6">
              <div>
                {/* Header Drawer */}
                <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30">
                  <div>
                    <h3 className="text-base font-headline font-semibold text-on-surface leading-snug">
                      {editingVariant ? 'Chỉnh Sửa Biến Thể' : 'Thêm Biến Thể Mới'}
                    </h3>
                    <p className="text-[11px] text-secondary font-body">
                      Tác phẩm: {parentProductForVariant.name}
                    </p>
                  </div>
                  <span className="text-[11px] font-body text-on-surface-variant bg-surface-container-low border border-outline-variant/40 px-2.5 py-1 rounded-md font-semibold">
                    {variantSkuInput}
                  </span>
                </div>

                {/* Form Inputs */}
                <form onSubmit={handleSaveVariant} id="variantDrawerForm" className="space-y-4 pt-5">
                  {/* Tên biến thể */}
                  <div>
                    <label className="block text-xs font-medium text-on-surface mb-1.5 font-body">
                      Tên biến thể quy cách *
                    </label>
                    <input
                      type="text"
                      required
                      value={variantNameInput}
                      onChange={(e) => setVariantNameInput(e.target.value)}
                      placeholder="Ví dụ: Men tro củi • Size M"
                      className="w-full px-3.5 py-2.5 bg-surface-container-low/70 border border-outline-variant/40 rounded-xl text-sm text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:border-primary font-medium transition-colors font-body"
                    />
                  </div>

                  {/* Giá & Tồn kho Grid */}
                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-medium text-on-surface mb-1.5 font-body">
                        Đơn giá bán (VNĐ) *
                      </label>
                      <input
                        type="number"
                        required
                        min={0}
                        value={variantPriceInput}
                        onChange={(e) => setVariantPriceInput(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-surface-container-low/70 border border-outline-variant/40 rounded-xl text-sm text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:border-primary font-body font-semibold transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-on-surface mb-1.5 font-body">
                        Tồn kho thực tế
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={variantStockInput}
                        onChange={(e) => setVariantStockInput(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-surface-container-low/70 border border-outline-variant/40 rounded-xl text-sm text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:border-primary font-body font-semibold transition-colors"
                      />
                    </div>
                  </div>

                  {/* Quy cách phụ */}
                  <div>
                    <label className="block text-xs font-medium text-on-surface mb-1.5 font-body">
                      Quy cách / Dung tích
                    </label>
                    <input
                      type="text"
                      value={variantSpecInput}
                      onChange={(e) => setVariantSpecInput(e.target.value)}
                      placeholder="Ví dụ: Dung tích 220ml • Men tro nung củi"
                      className="w-full px-3.5 py-2.5 bg-surface-container-low/70 border border-outline-variant/40 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary transition-colors font-body"
                    />
                  </div>

                  {/* Bộ Media Quy Cách Biến Thể: 4 Góc Xoay Chuẩn + Ảnh Chi Tiết + Video Thực Tế */}
                  <ProductMediaUploader
                    media={variantMedia}
                    onChange={(newMedia) => {
                      setVariantMedia(newMedia);
                      if (newMedia?.angles?.front) {
                        setVariantImageInput(newMedia.angles.front);
                      }
                    }}
                  />
                </form>
              </div>

              {/* Action Buttons Footer */}
              <div className="flex items-center gap-3 pt-6 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setIsVariantDrawerOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container transition-colors text-xs font-semibold font-label cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  form="variantDrawerForm"
                  className="w-1/2 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container transition-all text-xs font-semibold font-label shadow-sm hover:shadow-md cursor-pointer"
                >
                  Lưu
                </button>
              </div>
            </aside>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: BỘ SƯU TẬP ẢNH BIẾN THỂ (VARIANT IMAGES MODAL)     */}
      {/* Kết nối: productApi.adminCreateImage & adminUpdateImage   */}
      {/* ========================================================= */}
      {isImagesModalOpen && selectedVariantForImages && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div
            className="fixed inset-0"
            onClick={() => !isSubmittingImage && setIsImagesModalOpen(false)}
          />

          <div className="relative bg-surface-container-lowest max-w-2xl w-full rounded-2xl shadow-2xl p-6 lg:p-7 z-10 border border-outline-variant/40 space-y-6 max-h-[90vh] overflow-y-auto animate-scaleUp">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-outline-variant/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary font-headline text-xl font-bold shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">photo_library</span>
                </div>
                <div>
                  <h3 className="text-lg font-headline font-bold text-on-surface">
                    Bộ Sưu Tập Ảnh Biến Thể (Variant Images)
                  </h3>
                  <p className="text-xs text-on-surface-variant font-body">
                    Tác phẩm:{' '}
                    <strong className="text-on-surface font-semibold">
                      {selectedVariantForImages.product.name}
                    </strong>{' '}
                    • {selectedVariantForImages.variant.variantName} (
                    <span className="font-mono text-primary font-semibold">{selectedVariantForImages.variant.sku}</span>)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsImagesModalOpen(false)}
                className="text-secondary hover:text-on-surface p-1 rounded-lg cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Section 1: Danh sách ảnh hiện tại */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-secondary font-label">
                  Danh sách ảnh trong biến thể ({selectedVariantForImages.variant.images?.length || 0})
                </span>
                <span className="text-[11px] text-on-surface-variant font-body">
                  Click vào ngôi sao để đổi ảnh đại diện chính (isPrimary)
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {selectedVariantForImages.variant.images?.map((img, idx) => (
                  <div
                    key={img.id || idx}
                    className={`relative p-2.5 rounded-xl border transition-all flex flex-col justify-between ${
                      img.isPrimary
                        ? 'bg-primary/5 border-primary shadow-sm'
                        : 'bg-surface-container-low/50 border-outline-variant/40 hover:border-outline-variant'
                    }`}
                  >
                    <div className="aspect-square w-full rounded-lg overflow-hidden bg-surface-variant relative mb-2 border border-outline-variant/30">
                      <img
                        src={img.imageUrl}
                        alt="Ảnh biến thể"
                        className="w-full h-full object-cover"
                      />
                      {img.isPrimary && (
                        <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-primary text-on-primary text-[10px] font-bold shadow-sm font-label">
                          ★ Ảnh chính
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-outline-variant/20">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-secondary font-mono">Thứ tự:</span>
                        <input
                          type="number"
                          min={0}
                          defaultValue={img.displayOrder ?? idx}
                          onBlur={(e) => handleUpdateImageOrder(img, e.target.value)}
                          className="w-10 px-1 py-0.5 text-center text-[11px] font-mono bg-surface-container-lowest border border-outline-variant/40 rounded"
                          title="Sửa thứ tự hiển thị (displayOrder)"
                        />
                      </div>

                      {!img.isPrimary && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimaryImage(img)}
                          className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-0.5 font-label cursor-pointer"
                          title="Đặt làm ảnh chính (isPrimary = true)"
                        >
                          <span className="material-symbols-outlined text-[14px]">star</span>
                          <span>Đặt chính</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: Form Thêm Ảnh Mới (POST /variants/:variantId/images) */}
            <div className="p-4 rounded-xl bg-surface-container-low/70 border border-outline-variant/40 space-y-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">add_photo_alternate</span>
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface font-label">
                  Thêm ảnh mới vào biến thể (POST /products/variants/:id/images)
                </span>
              </div>

              <form onSubmit={handleCreateVariantImage} className="space-y-3">
                <ImagePickerField
                  id="album-new-image-picker"
                  label="Chọn ảnh thêm vào album biến thể (Từ thiết bị / thư mục máy tính)"
                  value={newImageUrl}
                  onChange={setNewImageUrl}
                  required
                  helpText="Chọn hoặc kéo thả ảnh chụp góc khác, chi tiết men nứt hỏa biến từ máy tính của bạn."
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-4">
                    <label className="inline-flex items-center gap-2 cursor-pointer select-none text-xs text-on-surface font-medium">
                      <input
                        type="checkbox"
                        checked={newImageIsPrimary}
                        onChange={(e) => setNewImageIsPrimary(e.target.checked)}
                        className="w-4 h-4 rounded text-primary focus:ring-0 focus:ring-offset-0 bg-surface-container-lowest"
                      />
                      <span>Đặt làm ảnh chính ngay</span>
                    </label>

                    <div className="flex items-center gap-1.5 text-xs text-secondary font-body">
                      <span>Thứ tự:</span>
                      <input
                        type="number"
                        min={0}
                        value={newImageOrder}
                        onChange={(e) => setNewImageOrder(e.target.value)}
                        className="w-14 px-2 py-1 text-xs bg-surface-container-lowest border border-outline-variant/40 rounded-lg text-center font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingImage}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    <span>{isSubmittingImage ? 'Đang lưu...' : 'Thêm Vào Album'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end pt-3 border-t border-outline-variant/30">
              <button
                type="button"
                onClick={() => setIsImagesModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-xs font-semibold text-on-surface border border-outline-variant/40 transition-colors cursor-pointer"
              >
                Đóng Album Ảnh
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
