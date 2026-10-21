import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, Copy, Check, X, Camera, ExternalLink } from 'lucide-react';

interface CeremonyQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  ceremonyName: string;
  weddingId: string;
  coupleNames: string;
  onOpenLiveStream: (ceremonyName: string) => void;
}

export const CeremonyQRModal: React.FC<CeremonyQRModalProps> = ({
  isOpen,
  onClose,
  ceremonyName,
  weddingId,
  coupleNames,
  onOpenLiveStream,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Construct direct ceremony live link
  const liveUrl = typeof window !== 'undefined'
    ? `${window.location.origin}?liveCeremony=${encodeURIComponent(ceremonyName)}&weddingId=${weddingId}`
    : '';

  useEffect(() => {
    if (isOpen && liveUrl) {
      QRCode.toDataURL(liveUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch(() => {});
    }
  }, [isOpen, liveUrl]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(liveUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `QR_${coupleNames.replace(/\s+/g, '_')}_${ceremonyName.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-xl border border-stone-800 bg-stone-950 p-6 text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded bg-white text-black">
              <QrCode className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold">
                Ceremony QR Code
              </h3>
              <p className="text-xs text-stone-400">
                {ceremonyName} · {coupleNames}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-stone-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* QR Code Graphic Frame */}
        <div className="mt-6 flex flex-col items-center justify-center space-y-4">
          <div className="rounded-lg bg-white p-4 shadow-xl">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`QR code for ${ceremonyName}`}
                className="h-56 w-56 object-contain"
              />
            ) : (
              <div className="flex h-56 w-56 items-center justify-center text-xs text-stone-400">
                Generating QR...
              </div>
            )}
          </div>

          <div className="text-center px-4 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-200">
              Scan to view live pictures
            </p>
            <p className="text-[11px] text-stone-400">
              Guests scan this QR at tables to see uploaded pictures instantly in real-time.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 grid grid-cols-2 gap-2.5 pt-4 border-t border-stone-800">
          <button
            onClick={handleDownloadQR}
            className="inline-flex items-center justify-center gap-1.5 rounded bg-white px-3 py-2 text-xs font-semibold text-black hover:bg-stone-200 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download QR</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="inline-flex items-center justify-center gap-1.5 rounded border border-stone-700 bg-stone-900 px-3 py-2 text-xs font-semibold text-white hover:bg-stone-800 transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span>Link Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Live Link</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-3">
          <button
            onClick={() => {
              onClose();
              onOpenLiveStream(ceremonyName);
            }}
            className="w-full inline-flex items-center justify-center gap-1.5 rounded border border-stone-700 bg-stone-900 py-2 text-xs font-medium text-stone-300 hover:text-white hover:bg-stone-800"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Preview Live Stream View Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
