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
      // Add willReadFrequently option for better performance
      const context = canvas.getContext('2d', { willReadFrequently: true });
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
        
        // Animate the reveal
        if (canvasRef.current && contextRef.current) {
          const canvas = canvasRef.current;
          const context = contextRef.current;
          
          // Animation duration in milliseconds
          const duration = 3000; // 3 seconds
          const startTime = Date.now();
          
          const fadeOut = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out function for smoother animation
            const opacity = 1 - (progress * progress);
            
            // Clear canvas
            context.globalCompositeOperation = 'source-over';
            context.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw gradient with reducing opacity
            const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, `rgba(252, 231, 243, ${opacity})`);
            gradient.addColorStop(1, `rgba(251, 207, 232, ${opacity})`);
            context.fillStyle = gradient;
            context.fillRect(0, 0, canvas.width, canvas.height);

            // Draw hearts with reducing opacity
            context.font = '20px Arial';
            context.fillStyle = `rgba(249, 168, 212, ${opacity})`;
            for (let i = 0; i < canvas.width; i += 40) {
              for (let j = 0; j < canvas.height; j += 40) {
                context.fillText('❤️', i, j);
              }
            }

            // Draw the revealed code with increasing opacity
            context.font = 'bold 48px Arial';
            context.fillStyle = `rgba(0, 0, 0, ${progress})`;
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(result.code, canvas.width / 2, canvas.height / 2);

            if (progress < 1) {
              requestAnimationFrame(fadeOut);
            } else {
              // Animation complete
              setLocalIsScratched(true);
              setLocalCode(result.code);
            }
          };

          fadeOut();
        }
      }
    } catch (error) {
      console.error('Failed to scratch card:', error);
    } finally {
      setTimeout(() => {
        setIsScratchInProgress(false);
      }, 3000); // Match animation duration
    }
  };

  const renderExpandedCard = () => (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all-slow ${
        isExpanded ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
      style={{
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)'
      }}
      onClick={() => setIsExpanded(false)}
    >
      <div
        className={`relative w-full max-w-lg aspect-[3/4] bg-white border-4 border-black rounded-lg transition-all-slow ${
          isExpanded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        style={{ 
          boxShadow: '6px 6px 0 0 #000',
          transform: `scale(${isExpanded ? '1' : '0.95'}) translateY(${isExpanded ? '0' : '10px'})`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {(localIsScratched || revealedCode) ? (
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center p-4 transition-all-slow"
            style={{
              opacity: isExpanded ? 1 : 0,
              transform: `translateY(${isExpanded ? '0' : '20px'})`,
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.2s'
            }}
          >
            <div 
              className="text-4xl font-bold mb-4"
              style={{
                opacity: isExpanded ? 1 : 0,
                transform: `scale(${isExpanded ? '1' : '0.9'})`,
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.3s'
              }}
            >
              {revealedCode || localCode}
            </div>
            <p 
              className="text-sm text-gray-500"
              style={{
                opacity: isExpanded ? 1 : 0,
                transform: `translateY(${isExpanded ? '0' : '10px'})`,
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.4s'
              }}
            >
              Click outside to close
            </p>
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
            className="absolute inset-0 w-full h-full cursor-pointer rounded-lg touch-none transition-opacity-slow"
            style={{
              opacity: isExpanded ? 1 : 0
            }}
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