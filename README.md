# 🎭 AIA Roleplay Training - Context Prompt Generator

Dự án này là một công cụ hỗ trợ các Tư vấn viên (TVV) bảo hiểm AIA tạo ra các **Context Prompt** chất lượng cao để thực hiện roleplay (đóng vai) với các mô hình AI (như Gemini, ChatGPT). Ngoài ra, ứng dụng còn cung cấp tính năng phân tích và đánh giá cuộc trò chuyện dựa trên AI.

## 🚀 Tính năng chính

### 1. Quản lý Hồ sơ Tư vấn viên (Advisor Profile)
- Thiết lập thông tin cá nhân, kinh nghiệm và thế mạnh của TVV.
- **Xuất/Nhập JSON:** Dễ dàng lưu trữ và đồng bộ hồ sơ qua các thiết bị khác nhau.

### 2. Thiết lập Khách hàng Chi tiết (Customer Setup)
- **Tâm lý khách hàng:** Chọn 7 loại tính cách đặc trưng (Hoài nghi, Phân tích, Cảm xúc, Né tránh...) và mức độ tin tưởng.
- **Bối cảnh tư vấn:** Thiết lập hình thức gặp mặt (Online/Offline), tính chất cuộc gặp và thời gian khả dụng.
- **Phân khúc:** Hỗ trợ cả Mass Market và High-Net-Worth (HNW) với các trường thông tin chuyên sâu.

### 3. Lựa chọn Giai đoạn Roleplay (Stage Selection)
- Cho phép chọn cụ thể các giai đoạn trong luồng tư vấn (Mở đầu, Khám phá nhu cầu, Trình bày giải pháp, Chốt deal...).
- AI sẽ tập trung vào bối cảnh của giai đoạn đã chọn.

### 4. Tạo Context Prompt Thông minh
- Tự động tạo ra một bản mô tả nhân vật (persona) cực kỳ chi tiết, bao gồm cả các hành vi và mẫu câu từ chối đặc trưng theo tính cách.
- **Download JSON:** Lưu trữ prompt đã tạo dưới dạng file để sử dụng lại.

### 5. Review & Phân tích cuộc trò chuyện (Conversation Review)
- Sử dụng **Gemini API** để phân tích log chat.
- Đánh giá điểm mạnh, điểm yếu, mức độ xây dựng niềm tin và gợi ý cải thiện cụ thể cho TVV.

## 🛠 Technical Stack

- **Frontend:** React.js, Vite
- **Styling:** Vanilla CSS (theo AIA Design System)
- **AI Integration:** Google Generative AI (Gemini SDK)
- **State Management:** React Hooks & LocalStorage
- **Routing:** React Router DOM

## 💻 Cài đặt và Chạy thử

1. **Clone project:**
   ```bash
   git clone [repository-url]
   ```

2. **Cài đặt dependencies:**
   ```bash
   npm install
   ```

3. **Chạy dev server:**
   ```bash
   npm run dev
   ```

4. **Sử dụng:**
   - Truy cập `http://localhost:5173`
   - Đăng ký hồ sơ TVV.
   - Bắt đầu tạo khách hàng và sinh Prompt.
   - Sử dụng Gemini API Key để thực hiện tính năng Review.

## 📁 Cấu trúc thư mục

- `src/constants/`: Chứa các cấu hình về luồng tư vấn, field form và tính cách.
- `src/pages/`: Các trang chính (Home, Setup, Result, Review, History).
- `src/prompts/`: Logic sinh prompt và các template đánh giá.
- `src/services/`: Xử lý lưu trữ LocalStorage và kết nối API Gemini.
- `src/styles/`: Định nghĩa design tokens và global styles.

## 📄 License

Dự án được phát triển cho mục đích đào tạo nội bộ.
