import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  model: string;
  onSave: (key: string, model: string) => void;
}

export default function SettingsModal({ isOpen, onClose, apiKey, model, onSave }: SettingsModalProps) {
  const [tempKey, setTempKey] = useState(apiKey);
  const [tempModel, setTempModel] = useState(model);

  useEffect(() => {
    if (isOpen) {
      setTempKey(apiKey);
      setTempModel(model);
    }
  }, [isOpen, apiKey, model]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(tempKey, tempModel);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <h2 className="text-lg font-bold text-white">Cấu hình OpenRouter</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">OpenRouter API Key</label>
            <input 
              type="password"
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              placeholder="sk-or-v1-..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
            <p className="text-xs text-slate-500 mt-1">Lấy key tại: openrouter.ai/settings/keys (Key được lưu cục bộ trên trình duyệt của bạn).</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Model ID</label>
            <input 
              type="text"
              value={tempModel}
              onChange={(e) => setTempModel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
            <p className="text-xs text-slate-500 mt-1">Mặc định: google/gemini-3.5-flash (Hãy chắc chắn model có hỗ trợ Vision).</p>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 flex justify-between gap-2">
          <button 
            onClick={() => {
              setTempKey('');
              onSave('', tempModel);
              onClose();
            }}
            className="px-4 py-2 text-sm font-medium text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            Xóa Key
          </button>
          <div className="flex gap-2">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-lg transition-colors"
            >
              Lưu cấu hình
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
