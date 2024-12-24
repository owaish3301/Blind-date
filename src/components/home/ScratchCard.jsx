import { useState, useRef, useEffect } from 'react';

function ScratchCard({ id, isLocked, code: initialCode, isScratched: initialIsScratched, scratchedAt, onScratch }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localIsScratched, setLocalIsScratched] = useState(initialIsScratched);
  const [localCode, setLocalCode] = useState(initialCode);
  const [isScratchInProgress, setIsScratchInProgress] = useState(false);
  const [revealedCode, setRevealedCode] = useState(null);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    setLocalIsScratched(initialIsScratched);
    setLocalCode(initialCode);
  }, [initialIsScratched, initialCode]);

  useEffect(() => {
    if (isExpanded && canvasRef.current && !localIsScratched) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      contextRef.current = context;

      // Set canvas size after DOM is updated
      requestAnimationFrame(() => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#fce7f3');
        gradient.addColorStop(1, '#fbcfe8');
        
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.font = '20px Arial';
        context.fillStyle = '#f9a8d4';
        for (let i = 0; i < canvas.width; i += 40) {
          for (let j = 0; j < canvas.height; j += 40) {
            context.fillText('❤️', i, j);
          }
        }
      });
    }
  }, [isExpanded, localIsScratched]);

  const handleReveal = async () => {
    if (isScratchInProgress) return;
    
    setIsScratchInProgress(true);
    try {
      const result = await onScratch(id);
      if (result?.code) {
        setRevealedCode(result.code);
        setLocalIsScratched(true);
        setLocalCode(result.code);
        
        // Update canvas to show revealed code
        if (canvasRef.current && contextRef.current) {
          const canvas = canvasRef.current;
          const context = contextRef.current;
          
          // Clear canvas
          context.globalCompositeOperation = 'source-over';
          context.clearRect(0, 0, canvas.width, canvas.height);
          
          // Draw white background
          context.fillStyle = 'white';
          context.fillRect(0, 0, canvas.width, canvas.height);
          
          // Draw revealed code
          context.font = 'bold 48px Arial';
          context.fillStyle = '#000';
          context.textAlign = 'center';
          context.textBaseline = 'middle';
          context.fillText(result.code, canvas.width / 2, canvas.height / 2);
        }
      }
    } catch (error) {
      console.error('Failed to scratch card:', error);
    } finally {
      setIsScratchInProgress(false);
    }
  };

  const renderExpandedCard = () => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={() => setIsExpanded(false)}
    >
      <div
        className="relative w-full max-w-lg aspect-[3/4] bg-white border-4 border-black rounded-lg shadow-[6px_6px_0_0_#000]"
        onClick={(e) => e.stopPropagation()}
      >
        {(localIsScratched || revealedCode) ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <div className="text-4xl font-bold mb-4">{revealedCode || localCode}</div>
            <p className="text-sm text-gray-500">Click outside to close</p>
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            onMouseDown={() => isDrawing.current = true}
            onMouseUp={() => isDrawing.current = false}
            onMouseOut={() => isDrawing.current = false}
            onMouseMove={handleScratch}
            onTouchStart={(e) => {
              e.preventDefault();
              isDrawing.current = true;
            }}
            onTouchMove={(e) => {
              e.preventDefault();
              handleScratch(e);
            }}
            onTouchEnd={() => isDrawing.current = false}
            className="absolute inset-0 w-full h-full cursor-pointer rounded-lg touch-none"
          />
        )}
      </div>
    </div>
  );

  const handleScratch = (e) => {
    if (!isDrawing.current || !contextRef.current || isScratchInProgress) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    const y = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
    const offsetX = x - rect.left;
    const offsetY = y - rect.top;

    const context = contextRef.current;
    context.globalCompositeOperation = 'destination-out';
    context.beginPath();
    context.arc(offsetX, offsetY, 20, 0, Math.PI * 2);
    context.fill();

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] < 128) transparent++;
    }

    const progress = (transparent / (pixels.length / 4)) * 100;
    
    if (progress > 50 && !localIsScratched && !isScratchInProgress) {
      handleReveal();
    }
  };

  if (localIsScratched || initialIsScratched) {
    return (
      <div className="relative w-full aspect-[3/4]">
        <div 
          className="absolute inset-0 bg-white border-4 border-black rounded-lg shadow-[6px_6px_0_0_#000] overflow-hidden cursor-pointer"
          onClick={() => setIsExpanded(true)}
        >
          <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="text-4xl font-bold mb-4">{localCode || initialCode}</div>
            {scratchedAt && (
              <p className="text-sm text-gray-500">
                Scratched {new Date(scratchedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
        {isExpanded && renderExpandedCard()}
      </div>
    );
  }

  if (isLocked) {
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

  return (
    <div className="relative w-full aspect-[3/4]">
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
      {isExpanded && renderExpandedCard()}
    </div>
  );
}

export default ScratchCard;