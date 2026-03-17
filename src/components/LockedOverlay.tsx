'use client';
import React, { useState } from 'react';

interface LockedOverlayProps {
  requiredTier: 'PRO' | 'PREMIUM';
  onUnlock?: () => void;
}

export default function LockedOverlay({ requiredTier, onUnlock }: LockedOverlayProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const tierColor = requiredTier === 'PREMIUM' ? '#FFD700' : '#00f2ff';
  const tierGlow = requiredTier === 'PREMIUM' ? 'rgba(255,215,0,0.4)' : 'rgba(0,242,255,0.4)';

  return (
    <div
      className="locked-overlay"
      onClick={onUnlock}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="lock-icon-wrap">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={tierColor} strokeWidth="2.5">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      </div>
      {showTooltip && (
        <div className="tier-tooltip">
          Disponible en plan <strong>{requiredTier}</strong>
        </div>
      )}
      <style jsx>{`
        .locked-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(6px) grayscale(0.3);
          -webkit-backdrop-filter: blur(6px) grayscale(0.3);
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border-radius: inherit;
          transition: 0.3s;
        }
        .locked-overlay:hover { background: rgba(0,0,0,0.65); }
        .lock-icon-wrap {
          filter: drop-shadow(0 0 12px ${tierGlow});
          animation: lockPulse 2s ease-in-out infinite;
        }
        @keyframes lockPulse {
          0%, 100% { filter: drop-shadow(0 0 8px ${tierGlow}); transform: scale(1); }
          50% { filter: drop-shadow(0 0 20px ${tierGlow}); transform: scale(1.1); }
        }
        .tier-tooltip {
          position: absolute;
          bottom: 20px;
          background: rgba(10,10,10,0.95);
          border: 1px solid ${tierColor};
          color: ${tierColor};
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 700;
          white-space: nowrap;
          box-shadow: 0 0 15px ${tierGlow};
          letter-spacing: 0.5px;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
