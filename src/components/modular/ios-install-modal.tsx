"use client";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function IOSInstallModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">Install App</h2>

        <ol className="space-y-2 list-decimal pl-5">
          <li>Tap the Share button.</li>
          <li>Select "Add to Home Screen".</li>
          <li>Tap Add.</li>
        </ol>

        <button
          className="mt-6 w-full rounded bg-black text-white py-2"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
