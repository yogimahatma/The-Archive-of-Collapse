import React, { useState, useCallback } from 'react';
import { Input, TextArea, Select } from './components/Input';
import { Button } from './components/Button';
import { OutputArea } from './components/OutputArea';
import { CaseFormData } from './types';
import { generateArchiveStory } from './services/geminiService';

// Only Catalysts are randomized now, Location is fixed.
// These have been adapted to fit the "Eastern Kentucky Farmhouse" setting.
const CATALYST_OPTIONS = [
  "A charismatic leader named Eldon convinced the twelve families that the apocalypse had occurred in 1812, and the outside world was nothing but ash and demons.",
  "The matriarch believed her bloodline carried a divine curse that could only be purified by marrying within the family to concentrate the 'holy' struggle.",
  "They believed the air outside the valley was slowly turning poisonous, and only the specific flora of their land provided breathable oxygen.",
  "A traveling preacher convinced them that human speech was a sin, and isolation was the only way to hear the 'True Frequency' of the universe.",
  "After a solar flare in the 19th century, they believed the sun had become a hostile entity that would incinerate the unfaithful, forcing them to live nocturnally.",
  "They discovered a parasitic organism in the deep soil that granted long life but demanded the consumption of raw flesh.",
  "A soldier returning from the Civil War convinced them that the government had been replaced by 'clockwork men', and only this farm remained pure.",
  "They found a book in the cellar that predicted the exact date of everyone's death, but only if they remained within the property lines."
];

const App: React.FC = () => {
  // Initial state set specifically to the Kentucky farmhouse scenario as requested
  const [formData, setFormData] = useState<CaseFormData>({
    location: "There’s a farmhouse still standing in the hills of eastern Kentucky",
    era: '',
    language: 'English',
    catalyst: "A charismatic leader named Eldon convinced the twelve families that the apocalypse had occurred in 1812, and the outside world was nothing but ash and demons."
  });
  
  const [story, setStory] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const randomizeScenario = useCallback(() => {
    // Only randomize the Catalyst. Location remains fixed.
    const randomCatalyst = CATALYST_OPTIONS[Math.floor(Math.random() * CATALYST_OPTIONS.length)];
    setFormData(prev => ({
      ...prev,
      catalyst: randomCatalyst
    }));
  }, []);

  const handleUnearthStory = useCallback(async () => {
    if (!formData.location || !formData.catalyst) return;
    
    setIsGenerating(true);
    setStory('');

    try {
      const streamReader = await generateArchiveStory(formData);
      const reader = streamReader.getReader();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setStory(prev => prev + value);
      }
    } catch (error) {
      console.error(error);
      setStory("ERROR: CONNECTION SEVERED. ARCHIVE ACCESSIBILITY DENIED.");
    } finally {
      setIsGenerating(false);
    }
  }, [formData]);

  return (
    <div className="min-h-screen bg-black text-zinc-300 selection:bg-red-900 selection:text-white pb-20">
      <div className="max-w-3xl mx-auto px-6 py-12">
        
        {/* Header */}
        <header className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-6xl font-serif tracking-widest text-zinc-100 uppercase border-b border-zinc-900 pb-8">
            The Archive of Collapse
          </h1>
          <p className="text-sm md:text-base font-serif italic text-zinc-500 tracking-wide">
            “Nature demands diversity. To deny it is to invite the end.”
          </p>
        </header>

        {/* Main Card */}
        <div className="bg-zinc-950/50 border border-zinc-900 p-6 md:p-10 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
           
           {/* Decorative corner accents */}
           <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-red-900/50"></div>
           <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-red-900/50"></div>
           <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-red-900/50"></div>
           <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-red-900/50"></div>

          <div className="mb-10 flex items-center gap-4">
            <div className="h-px bg-red-900/30 flex-1"></div>
            <h2 className="text-red-900/70 text-sm font-bold tracking-[0.2em] uppercase">New Case File</h2>
            <div className="h-px bg-red-900/30 flex-1"></div>
          </div>

          <div className="space-y-6">
            
            {/* Input Section: User enters Era & Language */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Starting Era"
                name="era"
                value={formData.era}
                onChange={handleInputChange}
                placeholder="e.g. Late 1800s"
                autoFocus
              />
              <Select 
                label="Language"
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                options={['English', 'Indonesian']}
              />
            </div>

            {/* Location (Fixed) */}
             <Input 
              label="Location / Setting (Locked)"
              name="location"
              value={formData.location}
              readOnly
              placeholder="Auto-generated location..."
              className="cursor-not-allowed opacity-70"
            />

            {/* Randomizer Divider - Moved below Location */}
            <div className="py-2 flex items-center justify-between gap-4">
              <div className="h-px bg-zinc-800 flex-1"></div>
              <button 
                onClick={randomizeScenario}
                type="button"
                className="group flex items-center gap-2 px-4 py-2 border border-zinc-800 rounded bg-zinc-950 hover:border-red-900/50 hover:bg-zinc-900 transition-all duration-300"
                title="Randomize Catalyst"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform duration-300">🎲</span>
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 group-hover:text-zinc-300">Randomize Catalyst</span>
              </button>
              <div className="h-px bg-zinc-800 flex-1"></div>
            </div>

            {/* Catalyst (Randomizable) */}
            <TextArea 
              label="The Catalyst for Isolation (Randomizable)"
              name="catalyst"
              value={formData.catalyst}
              readOnly
              placeholder="Auto-generated catalyst..."
            />
          </div>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-col md:flex-row gap-4 justify-end items-center">
            <Button 
              variant="primary" 
              onClick={handleUnearthStory} 
              isLoading={isGenerating}
              className="w-full min-w-[200px]"
            >
              {isGenerating ? 'Compiling sealed records...' : 'Unearth Story'}
            </Button>
          </div>

          {/* Story Output */}
          <OutputArea story={story} isGenerating={isGenerating} />

        </div>
        
        <footer className="mt-16 text-center text-zinc-800 text-xs font-mono uppercase tracking-widest">
          <p>Restricted Access // Clearance Level 4 Required</p>
          <p className="mt-2">System ID: 99-A-771</p>
        </footer>
      </div>
    </div>
  );
};

export default App;