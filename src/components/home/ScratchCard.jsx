import { useState, useRef, useEffect } from "react";

function ScratchCard({
  id,
  isLocked,
  code: initialCode,
  isScratched: initialIsScratched,
  scratchedAt,
  onScratch,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localIsScratched, setLocalIsScratched] = useState(initialIsScratched);
  const [localCode, setLocalCode] = useState(initialCode);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const isDrawing = useRef(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const scratchThreshold = useRef(50); 
  const lastProgress = useRef(0);

  useEffect(() => {
    setLocalIsScratched(initialIsScratched);
    setLocalCode(initialCode);
  }, [initialIsScratched, initialCode]);

  useEffect(() => {
    if (isExpanded && canvasRef.current && !localIsScratched) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      contextRef.current = context;

      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      context.fillStyle = "#fce7f3";
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [isExpanded, localIsScratched]);

  const handleReveal = async () => {
    if (isRevealing) return;

    try {
      setIsRevealing(true);
      const result = await onScratch(id);
      if (result?.code) {
        setLocalIsScratched(true);
        setLocalCode(result.code);
      }
    } catch (error) {
      console.error("Failed to scratch card:", error);
    } finally {
      setIsRevealing(false);
    }
  };
  
  const calculateScratchProgress = (context, canvas) => {
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] < 128) transparent++;
    }
    return (transparent / (pixels.length / 4)) * 100;
  };

  const handleScratch = (e) => {
    if (
      !isDrawing.current ||
      !contextRef.current ||
      isRevealing ||
      localIsScratched
    )
      return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
    const y = e.type.includes("mouse") ? e.clientY : e.touches[0].clientY;
    const offsetX = x - rect.left;
    const offsetY = y - rect.top;

    const context = contextRef.current;
    context.globalCompositeOperation = "destination-out";
    context.beginPath();
    context.arc(offsetX, offsetY, 20, 0, Math.PI * 2);
    context.fill();

    const currentProgress = calculateScratchProgress(context, canvas);
    if (
      currentProgress > scratchThreshold.current &&
      currentProgress > lastProgress.current &&
      !localIsScratched
    ) {
      handleReveal();
    }
    lastProgress.current = currentProgress;
  };

  const handleClose = () => {
    setIsExpanded(false);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (isLocked && !localIsScratched) {
    return (
      <div className="relative w-full aspect-[3/4]">
        <div className="absolute inset-0 bg-white border-4 border-black rounded-lg shadow-[6px_6px_0_0_#000] overflow-hidden">
          <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <span className="text-4xl mb-2">🔒</span>
            <p className="text-sm font-medium">Already Scratched</p>
          </div>
        </div>
      </div>
    );
  }

  if (localIsScratched || initialIsScratched) {
    return (
      <div className="relative w-full aspect-[3/4]">
        <div
          onClick={() => setIsExpanded(true)}
          className="absolute inset-0 bg-white border-4 border-black rounded-lg shadow-[6px_6px_0_0_#000] overflow-hidden cursor-pointer"
        >
          <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="text-4xl font-bold mb-4">
              {localCode || initialCode}
            </div>
            {scratchedAt && (
              <p className="text-sm text-gray-500">
                Scratched {new Date(scratchedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {isExpanded && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            onClick={handleBackdropClick}
          >
            <div className="relative w-full max-w-lg aspect-[3/4] bg-white border-4 border-black rounded-lg">
              <div className="w-full h-full flex flex-col items-center justify-center p-4">
                <div className="text-6xl font-bold mb-4">
                  {localCode || initialCode}
                </div>
                {scratchedAt && (
                  <p className="text-lg text-gray-500">
                    Scratched {new Date(scratchedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
              <button
                onClick={handleClose}
                className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full hover:bg-gray-100"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-[3/4]">
      {!isExpanded ? (
        <div
          onClick={() => setIsExpanded(true)}
          className="absolute inset-0 bg-white border-4 border-black rounded-lg shadow-[6px_6px_0_0_#000] overflow-hidden cursor-pointer"
        >
          <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="mb-4">
              <div className="heart text-4xl">❤️</div>
              <h3 className="text-lg font-bold text-center mt-2">Blind Date</h3>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={handleBackdropClick}
        >
          <div className="relative w-full max-w-lg aspect-[3/4] bg-white border-4 border-black rounded-lg">
            <canvas
              ref={canvasRef}
              onMouseDown={() => (isDrawing.current = true)}
              onMouseUp={() => (isDrawing.current = false)}
              onMouseOut={() => (isDrawing.current = false)}
              onMouseMove={handleScratch}
              onTouchStart={(e) => {
                e.preventDefault();
                isDrawing.current = true;
              }}
              onTouchMove={(e) => {
                e.preventDefault();
                handleScratch(e);
              }}
              onTouchEnd={() => (isDrawing.current = false)}
              className="absolute inset-0 w-full h-full cursor-pointer rounded-lg touch-none"
            />
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full hover:bg-gray-100"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ScratchCard;
