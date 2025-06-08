import React, { useEffect, useState } from 'react';

const MemeGenerator = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');

  useEffect(() => {
    fetch('https://api.imgflip.com/get_memes')
      .then(res => res.json())
      .then(data => {
        if(data.success){
          setTemplates(data.data.memes);
        }
      });
  }, []);

  return (
    <div>
      <h2>Select a Meme Template</h2>
      <div style={{ display: 'flex', overflowX: 'scroll', maxWidth: '100%' }}>
        {templates.map(template => (
          <img
            key={template.id}
            src={template.url}
            alt={template.name}
            width={100}
            style={{ cursor: 'pointer', marginRight: 10 }}
            onClick={() => setSelectedTemplate(template)}
          />
        ))}
      </div>

      {selectedTemplate && (
        <div style={{ marginTop: 20 }}>
          <img src={selectedTemplate.url} alt={selectedTemplate.name} width={400} />
          <input
            placeholder="Top Text"
            value={topText}
            onChange={e => setTopText(e.target.value)}
          />
          <input
            placeholder="Bottom Text"
            value={bottomText}
            onChange={e => setBottomText(e.target.value)}
          />
          {/* Add your meme export / sharing buttons here */}
          <div style={{ position: 'relative', width: 400 }}>
            <img src={selectedTemplate.url} alt="meme" width="400" />
            <h2 style={{ position: 'absolute', top: 10, left: 10, color: 'white', textShadow: '2px 2px 4px black' }}>
              {topText}
            </h2>
            <h2 style={{ position: 'absolute', bottom: 10, left: 10, color: 'white', textShadow: '2px 2px 4px black' }}>
              {bottomText}
            </h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemeGenerator;
