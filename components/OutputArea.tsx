import React, { useEffect, useRef } from 'react';

interface OutputAreaProps {
  story: string;
  isGenerating: boolean;
}

const SECTION_TITLES = [
  "I. THE LOCATION",
  "II. THE ORIGIN",
  "III. THE RISE",
  "IV. THE DESCENT",
  "V. THE INTERVENTION",
  "VI. THE COVER-UP",
  "VII. THE AFTERMATH",
  "VIII. FINAL NOTE"
];

export const OutputArea: React.FC<OutputAreaProps> = ({ story, isGenerating }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom as story generates
  useEffect(() => {
    if (containerRef.current && isGenerating) {
      const scrollHeight = containerRef.current.scrollHeight;
      const height = containerRef.current.clientHeight;
      const maxScrollTop = scrollHeight - height;
      
      // Only scroll if user is already near the bottom or it's the start
      if (maxScrollTop > 0) {
         containerRef.current.scrollTop = maxScrollTop;
      }
    }
  }, [story, isGenerating]);

  // Split the raw story string by the delimiter
  // This removes the "|||SECTION|||" text and gives us an array of content parts
  const sections = story.split("|||SECTION|||");

  return (
    <div className="mt-12 border-t-2 border-zinc-900 pt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-serif text-zinc-500 uppercase tracking-widest">
          Case File Narrative
        </h2>
        {isGenerating && (
          <span className="text-red-900 text-xs animate-pulse font-mono uppercase tracking-widest">
             [ Receiving Transmission ]
          </span>
        )}
      </div>
      
      <div 
        ref={containerRef}
        className="w-full min-h-[400px] max-h-[800px] overflow-y-auto p-4 md:p-8 bg-black border border-zinc-900 relative shadow-inner space-y-8"
      >
        {/* CRT scanline effect overlay */}
        <div className="sticky top-0 left-0 w-full h-0 overflow-visible pointer-events-none z-20">
            <div className="absolute inset-0 w-full h-[800px] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,6px_100%] opacity-20"></div>
        </div>

        {story ? (
          sections.map((sectionText, index) => {
            const cleanText = sectionText.trim();
            // Don't render empty sections (often happens at the very start before first chunk)
            if (!cleanText) return null;

            return (
              <div key={index} className="relative z-10 bg-zinc-950 border border-zinc-800 p-6 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700">
                 {/* Section Header */}
                <div className="mb-4 pb-2 border-b border-zinc-900 flex justify-between items-center">
                   <h3 className="text-red-900/80 font-bold tracking-[0.2em] text-xs uppercase font-sans">
                     {SECTION_TITLES[index] || `SECTION ${index + 1}`}
                   </h3>
                   <span className="text-zinc-800 font-mono text-[10px]">FILE-0{index + 1}</span>
                </div>

                <div className="font-mono text-zinc-300 leading-relaxed whitespace-pre-wrap opacity-90 text-sm md:text-base">
                  {cleanText}
                  {/* Only show cursor on the active (last) section being generated */}
                  {isGenerating && index === sections.length - 1 && (
                    <span className="inline-block w-2 h-4 ml-1 bg-red-900 animate-pulse align-middle"></span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-zinc-800 font-mono text-sm min-h-[300px]">
            <p className="animate-pulse">Waiting for case parameters...</p>
          </div>
        )}
      </div>
    </div>
  );
};