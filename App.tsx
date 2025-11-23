import React, { useState, useCallback, useEffect } from 'react';
import { NumberBall } from './components/NumberBall';

const App: React.FC = () => {
  // Configuração do intervalo
  const [minRange, setMinRange] = useState<number>(1);
  const [maxRange, setMaxRange] = useState<number>(100);

  // Estados do jogo
  const [availableNumbers, setAvailableNumbers] = useState<number[]>([]);
  const [chosenNumbers, setChosenNumbers] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);

  // Gera o pool de números baseado no min/max
  const generatePool = (min: number, max: number) => {
    if (min >= max) return [];
    return Array.from({ length: max - min + 1 }, (_, i) => min + i);
  };

  // Inicialização (roda uma vez ou quando clicamos em aplicar)
  const initializeGame = useCallback((min: number, max: number) => {
    const pool = generatePool(min, max);
    setAvailableNumbers(pool);
    setChosenNumbers([]);
    setCurrentNumber(null);
  }, []);

  // Roda a inicialização na montagem do componente
  useEffect(() => {
    initializeGame(1, 100);
  }, [initializeGame]);

  // Helper de ordenação
  const sortNumbers = (nums: number[]) => [...nums].sort((a, b) => a - b);

  // AÇÃO: Sortear número
  const handlePickNumber = useCallback(() => {
    if (availableNumbers.length === 0) return;

    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const selected = availableNumbers[randomIndex];

    // Atualiza UI
    setCurrentNumber(selected);
    setChosenNumbers((prev) => [...prev, selected]);
    setAvailableNumbers((prev) => prev.filter((n) => n !== selected));
  }, [availableNumbers]);

  // AÇÃO: Cancelar último
  const handleUndoLast = useCallback(() => {
    if (chosenNumbers.length === 0) return;

    const lastChosen = chosenNumbers[chosenNumbers.length - 1];
    const newChosenHistory = chosenNumbers.slice(0, -1);

    setChosenNumbers(newChosenHistory);
    setAvailableNumbers((prev) => sortNumbers([...prev, lastChosen]));
    
    const previousNumber = newChosenHistory.length > 0 ? newChosenHistory[newChosenHistory.length - 1] : null;
    setCurrentNumber(previousNumber);
  }, [chosenNumbers]);

  // AÇÃO: Aplicar novo intervalo (Reset)
  const handleApplyRange = () => {
    if (minRange >= maxRange) {
      alert("O número final deve ser maior que o inicial.");
      return;
    }
    initializeGame(minRange, maxRange);
  };

  const isPoolEmpty = availableNumbers.length === 0;
  const isHistoryEmpty = chosenNumbers.length === 0;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4 selection:bg-emerald-500 selection:text-white">
      
      {/* Header */}
      <header className="mb-6 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2">
          Sorteador Inteligente
        </h1>
        <p className="text-slate-400 text-sm">Defina o intervalo e sorteie sem repetição</p>
      </header>

      {/* Configuração de Intervalo */}
      <div className="w-full max-w-md bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 backdrop-blur-sm mb-6 flex gap-4 items-end shadow-lg">
        <div className="flex-1">
          <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Início</label>
          <input 
            type="number" 
            value={minRange}
            onChange={(e) => setMinRange(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-center text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Fim</label>
          <input 
            type="number" 
            value={maxRange}
            onChange={(e) => setMaxRange(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-center text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
          />
        </div>
        <button 
          onClick={handleApplyRange}
          className="bg-slate-700 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg border border-slate-600 hover:border-emerald-500 transition-all h-[42px]"
          title="Aplicar intervalo e reiniciar"
        >
          ⟳
        </button>
      </div>

      {/* Main Stage: Current Number */}
      <main className="w-full max-w-md flex flex-col items-center gap-6">
        
        <div className="h-40 flex flex-col items-center justify-center relative">
          {currentNumber !== null ? (
            <div className="relative z-10">
              <NumberBall number={currentNumber} status="current" />
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full border-4 border-slate-700 border-dashed flex items-center justify-center text-slate-600">
              <span className="text-sm font-semibold">Pronto</span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-4 w-full">
          <button
            onClick={handlePickNumber}
            disabled={isPoolEmpty}
            className={`flex-1 py-4 rounded-xl font-bold text-lg shadow-lg transform transition hover:-translate-y-1 active:scale-95 
              ${isPoolEmpty 
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20'}`}
          >
            {isPoolEmpty ? 'Finalizado' : 'Sortear'}
          </button>

          <button
            onClick={handleUndoLast}
            disabled={isHistoryEmpty}
            className={`flex-1 py-4 rounded-xl font-bold text-lg shadow-lg transform transition hover:-translate-y-1 active:scale-95
              ${isHistoryEmpty
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/20'}`}
          >
            Desfazer
          </button>
        </div>

        {/* Info Dashboard */}
        <div className="w-full grid grid-cols-1 gap-6 bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
          
          {/* Available Pool */}
          <div>
            <h3 className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-3 flex justify-between">
              <span>Disponíveis</span>
              <span>{availableNumbers.length}</span>
            </h3>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
              {availableNumbers.map((num) => (
                <NumberBall key={num} number={num} status="available" />
              ))}
              {availableNumbers.length === 0 && (
                <span className="text-slate-500 text-sm italic w-full text-center">Todos os números foram sorteados!</span>
              )}
            </div>
          </div>

          {/* History Line (divider) */}
          {chosenNumbers.length > 0 && (
            <div className="h-px w-full bg-slate-700/50"></div>
          )}

          {/* History */}
          {chosenNumbers.length > 0 && (
            <div>
              <h3 className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-3 flex justify-between">
                <span>Sorteados (Histórico)</span>
                <span>{chosenNumbers.length}</span>
              </h3>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                {chosenNumbers.map((num, idx) => (
                  <div key={`${num}-${idx}`} className={idx === chosenNumbers.length - 1 ? "ring-2 ring-emerald-500/50 rounded-full" : ""}>
                     <NumberBall number={num} status="chosen" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </main>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(71, 85, 105, 0.8);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 116, 139, 1);
        }
      `}</style>
    </div>
  );
};

export default App;