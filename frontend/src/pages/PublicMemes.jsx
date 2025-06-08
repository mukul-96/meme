import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PublicMemes = () => {
  const [memes, setMemes] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND}/api/memes/public`).then(res => {
      setMemes(res.data);
    });
  }, []);

  return (
    <div>
      <h1>Public Memes</h1>
      {memes.map((meme, i) => (
        <div key={i}>
          <img src={meme.imageUrl} alt="meme" width="300" />
          <p>{meme.topText}</p>
          <p>{meme.bottomText}</p>
        </div>
      ))}
    </div>
  );
};

export default PublicMemes;