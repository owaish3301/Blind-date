import { useState, useRef, useEffect } from 'react';

function ScratchCard({ id, isLocked, code, onScratch }) {
  const [isScratched, setIsScratched] = useState(!!code);
  const [isScratching, setIsScratching] = useState(false);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    contextRef.current = context;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Fill with scratch-off color
    context.fillStyle = '#fce7f3'; // Light pink
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const handleScratch = async (e) => {
    if (isLocked || isScratched || !contextRef.current) return;

    const { offsetX, offsetY } = e.nativeEvent;
    const context = contextRef.current;

    context.globalCompositeOperation = 'destination-out';
    context.beginPath();
    context.arc(offsetX, offsetY, 20, 0, Math.PI * 2);
    context.fill();

    // Calculate percentage scratched
    const imageData = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    const pixels = imageData.data;
    let transparent = 0;
    
    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] === 0) transparent++;
    }

    const percentScratched = (transparent / (pixels.length / 4)) * 100;

    if (percentScratched > 50 && !isScratching) {
      setIsScratching(true);
      try {
        const result = await onScratch(id);
        setIsScratched(true);
      } catch (error) {
        console.error('Failed to scratch card:', error);
      }
      setIsScratching(false);
    }
  };

  return (
    <div className="relative w-full aspect-[3/4]">
      <div className="absolute inset-0 bg-white border-4 border-black rounded-lg shadow-[6px_6px_0_0_#000] overflow-hidden">
        <div className="w-full h-full flex items-center justify-center">
          {isScratched ? (
            <div className="text-2xl font-bold">{code}</div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              {isLocked ? (
                <div className="relative flex flex-col items-center">
                  <div className="absolute w-full h-full">
                    <div className="chain-animation">
                      <div className="chain">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className="chain-link" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-4xl z-10">🔒</span>
                  <p className="text-sm font-bold mt-4 text-gray-600">Already Scratched</p>
                </div>
              ) : (
                <>
                  <canvas
                    ref={canvasRef}
                    onMouseDown={() => setIsScratching(true)}
                    onMouseUp={() => setIsScratching(false)}
                    onMouseMove={handleScratch}
                    onTouchMove={(e) => {
                      e.preventDefault();
                      const touch = e.touches[0];
                      const rect = e.target.getBoundingClientRect();
                      const event = {
                        nativeEvent: {
                          offsetX: touch.clientX - rect.left,
                          offsetY: touch.clientY - rect.top
                        }
                      };
                      handleScratch(event);
                    }}
                    className="absolute inset-0 w-full h-full cursor-pointer"
                  />
                  <div className="text-center pointer-events-none">
                    <span className="text-4xl mb-2">❤️</span>
                    <p className="text-sm font-bold mt-2">Scratch me!</p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ScratchCard;