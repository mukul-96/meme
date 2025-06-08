import React, { useEffect, useState } from 'react';

const MyMemes = () => {
  const [memes, setMemes] = useState([]);

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) return;

    const saved = JSON.parse(localStorage.getItem('memes') || '{}');
    setMemes(saved[userEmail] || []);
  }, []);

  if (!memes.length) return <div className="p-6 text-xl">No memes saved.</div>;

  return (
    <div className="p-6 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {memes.map((meme, i) => (
        <div key={i} className="border rounded shadow p-4 bg-white">
          <img src={meme.url} alt="Saved Meme" className="w-full h-auto rounded" />
          <p className="mt-2 text-sm text-gray-600">{meme.templateName}</p>
          <p className="text-xs text-gray-400">{new Date(meme.timestamp).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default MyMemes;
