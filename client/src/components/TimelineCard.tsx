import React, { useState, useEffect } from 'react';

interface TimelineCardProps {
  title: string;
  date: string;
  description: string;
}

export const TimelineCard: React.FC<TimelineCardProps> = ({ title, date, description }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [eventLink, setEventLink] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is connected
    fetch('http://localhost:3001/api/calendar/status', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setIsConnected(!!data.connected))
      .catch(() => setIsConnected(false));
  }, []);

  const handleAdd = async () => {
    if (!isConnected) {
      window.location.href = 'http://localhost:3001/api/calendar/auth';
      return;
    }

    setIsAdding(true);
    try {
      const res = await fetch('http://localhost:3001/api/calendar/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title, date, description }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdded(true);
        setEventLink(data.eventLink);
      } else if (res.status === 401) {
        // Token might have expired
        window.location.href = 'http://localhost:3001/api/calendar/auth';
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h3 className="font-bold text-lg text-slate-800">{title}</h3>
        <p className="text-slate-500 text-sm font-medium">{date}</p>
        <p className="text-slate-600 mt-1">{description}</p>
      </div>
      <div>
        {added ? (
          <a href={eventLink || '#'} target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 bg-green-100 text-green-700 font-medium rounded-lg hover:bg-green-200 transition-colors whitespace-nowrap">
            Event Added
          </a>
        ) : (
          <button 
            onClick={handleAdd}
            disabled={isAdding}
            className="px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {isAdding ? 'Adding...' : isConnected ? 'Add to Google Calendar' : 'Connect Calendar'}
          </button>
        )}
      </div>
    </div>
  );
};
