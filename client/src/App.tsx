import React from 'react';
import { ChatPanel } from './components/ChatPanel';
import { LanguageSwitcher } from './components/LanguageSwitcher';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-8 font-sans">
      <header className="max-w-2xl mx-auto mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-left">
          <h1 className="text-4xl font-extrabold text-blue-700 tracking-tight">VoteGuide</h1>
          <p className="mt-2 text-lg text-slate-600">Your interactive election assistant.</p>
        </div>
        <LanguageSwitcher />
      </header>

      <main className="max-w-2xl mx-auto h-[600px]">
        <ChatPanel />
      </main>
    </div>
  );
}

export default App;
