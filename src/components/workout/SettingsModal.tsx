import { useEffect } from 'react';
import { X } from 'lucide-react';
import { theme } from '../../theme';

const WEIGHT_MIN = 30;
const WEIGHT_MAX = 200;
const WEIGHT_STEP = 0.5;

interface Props {
  open: boolean;
  onClose: () => void;
  weightKg: number;
  onWeightKgChange: (kg: number) => void;
}

export default function SettingsModal({ open, onClose, weightKg, onWeightKgChange }: Props) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-sm rounded-[24px] p-5 shadow-2xl"
        style={{
          background: 'rgba(28, 28, 30, 0.96)',
          border: `1px solid ${theme.surfaceBorder}`,
          boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 mb-5">
          <h2 id="settings-modal-title" className="text-[17px] font-bold" style={{ color: theme.text }}>
            设置
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full -mr-1"
            style={{ color: theme.textSecondary }}
            aria-label="关闭"
          >
            <X size={22} strokeWidth={2} />
          </button>
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-2 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: theme.textTertiary }}>
              体重 (kg)
            </span>
            <span className="text-[22px] font-bold tabular-nums" style={{ color: theme.accentBright }}>
              {Number.isInteger(weightKg) ? weightKg : weightKg.toFixed(1)}
            </span>
          </div>
          <input
            type="range"
            min={WEIGHT_MIN}
            max={WEIGHT_MAX}
            step={WEIGHT_STEP}
            value={weightKg}
            onChange={e => onWeightKgChange(Number(e.target.value))}
            className="w-full h-2 rounded-full cursor-pointer"
            style={{ accentColor: theme.accent }}
          />
          <div className="flex justify-between mt-1.5 text-[10px] font-medium" style={{ color: theme.textTertiary }}>
            <span>{WEIGHT_MIN}</span>
            <span>{WEIGHT_MAX}</span>
          </div>
          <p className="text-[10px] mt-4 leading-relaxed" style={{ color: theme.textTertiary }}>
            用于估算卡路里消耗，可在训练前随时调整。
          </p>
        </div>
      </div>
    </div>
  );
}
