interface Props {
  onClose: () => void;
}

export default function InfoModal({ onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#375623] text-white px-5 py-3 flex items-center justify-between">
          <h2 className="font-bold text-sm uppercase tracking-wide">About This Calculator</h2>
          <button
            onClick={onClose}
            className="text-green-200 hover:text-white text-lg leading-none"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="px-5 py-4 space-y-4 text-sm text-gray-700">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Version</h3>
            <p>v1.11 · Last updated 2024-08-08 · Based on the 2006–2018 International Plumbing Code (IPC)</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Methodology</h3>
            <p>
              Fixture unit values are taken from IPC Table E102. Flow rates (GPM) are derived from
              Hunter's Curve using piecewise polynomial interpolation across flush tank and flush
              valve datasets. Pipe sizing recommendations are based on Type K copper at 8 fps (flush
              valve systems) and Type L copper at 5 fps (hot water).
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Disclaimer</h3>
            <p>
              For preliminary sizing only. Always verify results against project-specific conditions
              and the applicable adopted code. Do not use 2½″ pipe for water service piping per IPC
              requirements.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Original Author</h3>
            <p>Warren Rosenbrook — Henderson Engineers, Inc.</p>
          </div>
        </div>

        <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#375623] text-white text-sm rounded hover:bg-[#2d4a1c] focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
