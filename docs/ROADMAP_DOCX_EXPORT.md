# Lộ trình Tư duy Thiết kế: Tính năng Xuất Word (.docx) có thể chỉnh sửa Toán học

## 1. Xác định bài toán (Problem Statement)
**Bối cảnh:** 
- Tài liệu thuần văn chương, phả hệ: Chỉ cần xuất PDF hoặc HTML để lưu trữ, đọc là đủ.
- Tài liệu giáo dục (Đề thi, bài tập Toán/Lý/Hóa): Người dùng (Giáo viên) có nhu cầu **tái sử dụng** cao. Họ cần chỉnh sửa số liệu, cắt ghép câu hỏi.
**Vấn đề:** 
Làm thế nào để xuất một chuỗi văn bản chứa mã LaTeX (từ AI trả về) thành một file Word `.docx`, trong đó các công thức Toán học không bị biến thành ảnh (không sửa được) mà phải trở thành các **Khung phương trình chuẩn của Microsoft Word (Native Equation)**.

## 2. Phân tách Luồng xử lý (Data Pipeline)
Để tạo ra một file Word xịn xò 100% tại máy khách (Client-side) mà không cần Server, luồng dữ liệu sẽ đi qua 4 trạm:

1. **Trạm 1: Bóc tách (Parsing)**
   - Đầu vào là một chuỗi Markdown: `Giải phương trình $x^2 + 1 = 0$ ta được...`
   - Thuật toán (Regex hoặc AST Parser) sẽ quét và phân loại: Đâu là *Văn bản thường* (Text), đâu là *Công thức Toán* (Math inline `$...$` hoặc block `$$...$$`).

2. **Trạm 2: Trạm chuyển ngữ (Translation Engine)**
   - Không có thư viện nào dịch trực tiếp LaTeX sang Word ngay lập tức. Ta phải đi qua ngôn ngữ trung gian.
   - **Bước A:** Dịch `LaTeX` sang `MathML` (Ngôn ngữ đánh dấu chuẩn web cho Toán học).
   - **Bước B:** Dịch `MathML` sang `OMML` (Office Math Markup Language - Ngôn ngữ mẹ đẻ của Microsoft Word).

3. **Trạm 3: Lắp ráp (Document Assembly)**
   - Đưa văn bản thường thành các đoạn văn (`<w:p>`).
   - Đưa đoạn mã OMML thành các đối tượng phương trình (`<m:oMath>`).
   - Nối chúng lại với nhau để tạo thành cấu trúc XML của một tài liệu Word.

4. **Trạm 4: Đóng gói (Zipping/Exporting)**
   - File `.docx` bản chất là một file `.zip` chứa các file XML bên trong.
   - Hệ thống sẽ nén cấu trúc trên lại thành file `.docx` và kích hoạt hàm `window.saveAs` để trình duyệt tải file về máy.

## 3. Lựa chọn Công nghệ (Tech Stack)
Để đảm bảo ứng dụng vẫn nhẹ và chạy thuần Client, chúng ta sẽ chọn lọc thư viện rất kỹ:
- **`docx` (của dolanmiu):** Thư viện mạnh nhất hiện nay để tạo file Word bằng JavaScript. Giúp tạo Paragraph, TextRun dễ dàng.
- **`katex`:** Dùng API nội bộ của nó để render nhanh `LaTeX` sang chuỗi `MathML`. Rất nhẹ và chuẩn xác.
- **Module tự viết hoặc vi thư viện (Micro-library):** Một hàm XSLT hoặc quy tắc Regex tinh giản để chuyển `MathML` sang `OMML` (kế thừa ý tưởng từ tác giả bản gốc nhưng sẽ viết lại gọn hơn bằng TypeScript).

## 4. Lộ trình Triển khai Code (Roadmap)
Dự kiến code sẽ triển khai qua 3 bước rất mạch lạc:

- **Bước 1: Viết Engine Chuyển đổi Toán học (`src/utils/math-to-word.ts`)**
  Nhận đầu vào là chuỗi LaTeX -> Gọi KaTeX lấy MathML -> Biến đổi thành chuỗi OMML XML -> Trả về đối tượng `Math` của thư viện `docx`.
- **Bước 2: Viết Generator tạo Word (`src/utils/docx-generator.ts`)**
  Duyệt qua đoạn văn bản Markdown từ OpenRouter, bóc tách và lắp ráp thành một file `Document` hoàn chỉnh của thư viện `docx`. Kích hoạt tải về.
- **Bước 3: Gắn UI (`src/components/ResultViewer.tsx`)**
  Thêm nút **"Tải xuống Word"** (Màu xanh dương đặc trưng của Word) cạnh nút "Xuất PDF". Thêm trạng thái *Đang tạo file...* vì đôi khi xử lý công thức nặng sẽ mất 1-2 giây.

## 5. Trải nghiệm người dùng (UX) cuối cùng
- Giáo viên quăng đề thi vào, bấm OCR.
- Ngay khi có kết quả, nhấn **"Xuất Word"**.
- Trình duyệt tải ngay file `De-thi-OCR.docx`. Mở file bằng Word, các công thức toán hiện lên dưới dạng thanh công cụ **Equation Design** chuẩn chỉ. Giáo viên click vào sửa "x" thành "y" như đang soạn thảo bình thường.

---
*Tài liệu này được lập ra để định hướng kiến trúc, đảm bảo việc code sau này đi đúng trọng tâm, không sinh ra code rác hoặc phụ thuộc vào các thư viện quá nặng làm chậm ứng dụng.*
