"use client";

import Header from '@/components/Header';
import { BookOpen, CheckCircle, ShieldAlert, Cpu, FileText } from 'lucide-react';

export default function GuidePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-800 pb-4">
            <BookOpen className="text-sky-400" size={28} />
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Hướng dẫn sử dụng</h1>
          </div>

          <div className="space-y-10 text-slate-300">
            {/* Mục 1 */}
            <section>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-sky-400 mb-3">
                <Cpu size={20} /> 1. Cấu hình API Key (OpenRouter)
              </h2>
              <div className="pl-7 space-y-3">
                <p>
                  Ứng dụng sử dụng trí tuệ nhân tạo (Vision AI) thông qua cổng kết nối trung gian <strong>OpenRouter</strong>. 
                  Điều này giúp bạn tự do chuyển đổi giữa các AI mạnh nhất hiện nay mà chỉ cần dùng 1 mã API duy nhất.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-sm text-slate-400">
                  <li>Truy cập <a href="https://openrouter.ai/settings/keys" target="_blank" className="text-sky-400 hover:underline">openrouter.ai/settings/keys</a> để tạo tài khoản và lấy mã (bắt đầu bằng <code>sk-or-v1-</code>).</li>
                  <li>Click vào nút <strong>"Cấu hình API Key"</strong> ở góc phải phía trên của ứng dụng, dán mã vừa copy vào.</li>
                  <li>Mô hình (Model) được thiết lập mặc định là <code>google/gemini-3.5-flash</code>. Bạn có thể đổi sang các model khác nếu muốn (đảm bảo model đó hỗ trợ đọc ảnh).</li>
                </ul>
              </div>
            </section>

            {/* Mục 2 */}
            <section>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-emerald-400 mb-3">
                <FileText size={20} /> 2. Chuẩn bị tài liệu & Số trang
              </h2>
              <div className="pl-7 space-y-3">
                <p>
                  Ứng dụng này sinh ra để bóc tách các sách mờ, giấy nhăn, hoặc sách chứa dày đặc các <strong>công thức Toán học, Hóa học</strong>.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-sm text-slate-400">
                  <li><strong>Định dạng hỗ trợ:</strong> PDF (Sẽ tự động xuất thành ảnh ngầm), hoặc ảnh rời (JPG, PNG).</li>
                  <li>
                    <strong className="text-rose-400">Lưu ý quan trọng về Số trang:</strong> Để AI có thể đọc chính xác 100%, không bị "lười" và bỏ sót từ, 
                    <strong> mức lý tưởng nhất là tải lên từ 5 đến 12 trang / lần</strong>. 
                  </li>
                  <li>Bạn vui lòng tự cắt tài liệu (PDF) thành các phần nhỏ trước khi đưa vào ứng dụng. Nhồi quá 20 trang có thể làm AI cắt ngang câu trả lời vì quá giới hạn chữ.</li>
                </ul>
              </div>
            </section>

            {/* Mục 3 */}
            <section>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-indigo-400 mb-3">
                <CheckCircle size={20} /> 3. Chế độ xuất & Tải PDF
              </h2>
              <div className="pl-7 space-y-3">
                <ul className="list-disc pl-5 space-y-2 text-sm text-slate-400">
                  <li>
                    <strong className="text-slate-200">Bảo toàn (HTML):</strong> Cố gắng bắt chước lại cả lề, khung, và chia cột của trang sách cũ. Phù hợp để xem trực tiếp.
                  </li>
                  <li>
                    <strong className="text-slate-200">Tối giản (Markdown):</strong> Chỉ lấy chữ và công thức (viết bằng mã LaTeX), bỏ qua các trang trí. 
                    Phù hợp để mang file này đi thả vào các công cụ như <strong>NotebookLM, ChatGPT</strong> để phân tích chuyên sâu.
                  </li>
                  <li>
                    <strong>Xuất PDF (Mới):</strong> Nhấn nút "Xuất PDF", trình duyệt sẽ tự động giấu hết giao diện thừa và cho phép bạn in/lưu kết quả dưới dạng một file PDF Vector sắc nét (có thể bôi đen copy chữ thoải mái).
                  </li>
                </ul>
              </div>
            </section>

            {/* Mục 4 */}
            <section>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-purple-400 mb-3">
                <FileText size={20} /> 4. Chuyển đổi Markdown sang Word bằng Pandoc
              </h2>
              <div className="pl-7 space-y-3">
                <p className="text-sm text-slate-400">
                  Khi xuất file dạng <strong>Tối giản (Markdown)</strong>, các công thức toán học được chuẩn hóa sang dạng <code>\(...\)</code> và <code>\[...\]</code>. Để chuyển file <code>.md</code> này sang Microsoft Word (<code>.docx</code>) mà Word vẫn nhận diện đúng công thức (không bị lỗi raw text), bạn có thể dùng công cụ <strong>Pandoc</strong> với câu lệnh sau:
                </p>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-sm text-slate-300 overflow-x-auto whitespace-nowrap">
                  pandoc ket_qua_ocr.md -f markdown+tex_math_single_backslash-tex_math_dollars -o ket_qua_ocr.docx
                </div>
                <ul className="list-disc pl-5 space-y-2 text-sm text-slate-400">
                  <li><code>+tex_math_single_backslash</code>: Kích hoạt khả năng đọc công thức dùng dấu backslash <code>\(\)</code> và <code>\[\]</code>.</li>
                  <li><code>-tex_math_dollars</code>: Vô hiệu hóa dấu <code>$$</code> (để tránh lỗi nếu AI lỡ sinh nhầm).</li>
                  <li>Nếu bạn có file Word mẫu (template), hãy thêm <code>--reference-doc=template.docx</code> vào cuối câu lệnh để Word mới sinh ra giữ nguyên font chữ và lề của bạn.</li>
                </ul>
              </div>
            </section>

            {/* Mục 5 */}
            <section>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-amber-400 mb-3">
                <ShieldAlert size={20} /> 5. Quyền riêng tư (Privacy)
              </h2>
              <div className="pl-7 space-y-3 text-sm text-slate-400">
                <p>
                  Ứng dụng này hoạt động <strong>100% trên trình duyệt của bạn (Client-side)</strong>.
                </p>
                <p>
                  Điều này có nghĩa là tài liệu của bạn được biến thành ảnh và mã hóa ngay trên RAM của máy tính bạn. 
                  Từ đó, nó được gửi <strong>trực tiếp tới máy chủ OpenRouter</strong> mà KHÔNG hề đi qua bất kỳ máy chủ trung gian nào của trang web này.
                </p>
                <p>API Key của bạn được lưu an toàn trong <code>localStorage</code> của trình duyệt. Bạn có thể nhấn <strong>"Xóa Key"</strong> bất cứ lúc nào để hủy bỏ hoàn toàn.</p>
              </div>
            </section>
          </div>

        </div>
      </main>
    </div>
  );
}
