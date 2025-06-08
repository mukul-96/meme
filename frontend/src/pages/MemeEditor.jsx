import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Moveable from 'react-moveable';
import html2canvas from 'html2canvas';

const COLORS = ['black', 'white', 'red', 'blue', 'green', 'yellow', 'purple', 'orange'];

const MemeEditor = () => {
  const { templateId } = useParams();
  const [template, setTemplate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState(null);

  const [texts, setTexts] = useState([
    {
      id: 1,
      text: 'Your Text Here',
      x: 50,
      y: 50,
      color: 'white',
      fontSize: 24,
      bold: true,
    },
  ]);
  const [selectedId, setSelectedId] = useState(null);

  const containerRef = useRef(null);
  const textRefs = useRef({});

  // Load meme template
  useEffect(() => {
    axios.get('https://api.imgflip.com/get_memes').then(res => {
      const meme = res.data.data.memes.find(m => m.id === templateId);
      setTemplate(meme);
    }).catch(err => {
      setError('Failed to load meme template. Please try again.');
      console.error(err);
    });
  }, [templateId]);

  // Check for shared data in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dataParam = params.get('data');
    
    if (dataParam) {
      try {
        const data = JSON.parse(decodeURIComponent(dataParam));
        if (data.texts) {
          setTexts(data.texts);
        }
      } catch (error) {
        console.error('Failed to parse meme data', error);
      }
    }
  }, []);

  const handleDownload = async () => {
    setError(null);
    setIsDownloading(true);

    try {
      const dataUrl = await generateMemeImage();
      const link = document.createElement('a');
      link.download = 'meme.png';
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Download error:', error);
      setError('Failed to generate image. Please try again or use a different browser.');
    } finally {
      setIsDownloading(false);
    }
  };

  const getMemeShareUrl = () => {
    const shareData = {
      templateId,
      texts
    };
    return `${window.location.origin}/meme/${templateId}?data=${encodeURIComponent(JSON.stringify(shareData))}`;
  };

  const shareTwitter = () => {
    setIsSharing(true);
    setError(null);
    
    try {
      const shareUrl = getMemeShareUrl();
      const text = encodeURIComponent('Check out this meme I made!');
      const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`;
      window.open(twitterUrl, '_blank');
    } catch (error) {
      setError('Failed to share on Twitter');
      console.error(error);
    } finally {
      setIsSharing(false);
    }
  };

  const shareWhatsApp = () => {
    setIsSharing(true);
    setError(null);
    
    try {
      const shareUrl = getMemeShareUrl();
      const text = encodeURIComponent('Check out this meme I made!');
      window.open(`https://wa.me/?text=${text} ${encodeURIComponent(shareUrl)}`, '_blank');
    } catch (error) {
      setError('Failed to share on WhatsApp');
      console.error(error);
    } finally {
      setIsSharing(false);
    }
  };

  const shareFacebook = () => {
    setIsSharing(true);
    setError(null);
    
    try {
      const shareUrl = getMemeShareUrl();
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    } catch (error) {
      setError('Failed to share on Facebook');
      console.error(error);
    } finally {
      setIsSharing(false);
    }
  };

  const generateMemeImage = async () => {
    if (!containerRef.current || !template) {
      throw new Error('Meme container not ready');
    }

    // Create temporary container
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'fixed';
    tempContainer.style.left = '-9999px';
    tempContainer.style.width = `${template.width}px`;
    tempContainer.style.height = `${template.height}px`;
    
    // Add image
    const img = new Image();
    img.src = template.url;
    img.style.width = '100%';
    img.style.height = '100%';
    img.crossOrigin = 'Anonymous';
    tempContainer.appendChild(img);

    // Add text elements
    texts.forEach(text => {
      const textEl = document.createElement('div');
      textEl.textContent = text.text;
      textEl.style.position = 'absolute';
      textEl.style.left = `${text.x}px`;
      textEl.style.top = `${text.y}px`;
      textEl.style.color = text.color;
      textEl.style.fontSize = `${text.fontSize}px`;
      textEl.style.fontWeight = text.bold ? 'bold' : 'normal';
      textEl.style.textShadow = '2px 2px 4px rgba(0,0,0,0.7)';
      textEl.style.whiteSpace = 'nowrap';
      tempContainer.appendChild(textEl);
    });

    document.body.appendChild(tempContainer);

    try {
      // Wait for image to load
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // Generate canvas
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false
      });

      return canvas.toDataURL('image/png');
    } finally {
      document.body.removeChild(tempContainer);
    }
  };

  const addTextBox = () => {
    setTexts(prev => [
      ...prev,
      {
        id: Date.now(),
        text: 'New Text',
        x: 50,
        y: 50,
        color: 'white',
        fontSize: 24,
        bold: false,
      },
    ]);
  };

  const updateText = (id, key, value) => {
    setTexts(prev =>
      prev.map(t => (t.id === id ? { ...t, [key]: value } : t))
    );
  };

  const removeText = id => {
    setTexts(prev => prev.filter(t => t.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  if (!template) {
    return <div className="p-8 text-center text-xl">Loading template...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-6 text-center">{template.name} - Meme Editor</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Meme Container */}
        <div
          ref={containerRef}
          className="relative border border-gray-300 rounded-lg bg-gray-900 flex-shrink-0"
          style={{ width: template.width, height: template.height }}
          onClick={() => setSelectedId(null)}
        >
          <img
            src={template.url}
            alt={template.name}
            className="max-w-full max-h-full rounded select-none"
            draggable={false}
            style={{ userSelect: 'none' }}
          />

          {texts.map(({ id, text, x, y, color, fontSize, bold }) => (
            <div
              key={id}
              ref={el => (textRefs.current[id] = el)}
              onClick={e => {
                e.stopPropagation();
                setSelectedId(id);
              }}
              style={{
                position: 'absolute',
                top: y,
                left: x,
                color,
                fontWeight: bold ? '700' : '400',
                fontSize: `${fontSize}px`,
                cursor: 'move',
                userSelect: 'none',
                textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
                whiteSpace: 'nowrap',
              }}
            >
              {text}
            </div>
          ))}

          {selectedId && (
            <Moveable
              target={textRefs.current[selectedId]}
              container={containerRef.current}
              origin={false}
              draggable={true}
              throttleDrag={0}
              onDrag={({ left, top }) => {
                updateText(selectedId, 'x', left);
                updateText(selectedId, 'y', top);
              }}
              edge={false}
            />
          )}
        </div>

        {/* Editor Controls */}
        <div className="flex-1 space-y-6 overflow-auto max-h-[600px]">
          <button
            onClick={addTextBox}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            + Add Text Box
          </button>

          {texts.map(({ id, text, color, fontSize, bold }) => (
            <div key={id} className="border rounded p-4 bg-purple-200 text-white flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-black">Edit Text:</label>
                <button
                  onClick={() => removeText(id)}
                  className="text-red-500 hover:text-red-700 font-bold"
                >
                  Remove
                </button>
              </div>
              <input
                type="text"
                value={text}
                onChange={e => updateText(id, 'text', e.target.value)}
                className="rounded px-2 py-1 text-black w-full border-2"
              />
              <div className="flex items-center gap-4 flex-wrap">
                <label className="text-black">Color:</label>
                <select
                  value={color}
                  onChange={e => updateText(id, 'color', e.target.value)}
                  className="rounded px-2 py-1 text-black"
                >
                  {COLORS.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <label className="text-black">Font Size:</label>
                <input
                  type="number"
                  value={fontSize}
                  min={10}
                  max={72}
                  onChange={e => updateText(id, 'fontSize', Number(e.target.value))}
                  className="w-16 rounded px-2 py-1 text-black"
                />

                <label className="flex items-center gap-1 cursor-pointer text-black">
                  <input
                    type="checkbox"
                    checked={bold}
                    onChange={e => updateText(id, 'bold', e.target.checked)}
                  />
                  <span>Bold</span>
                </label>
              </div>
            </div>
          ))}

          {/* Action Buttons */}
          <div className="pt-4 flex gap-4 justify-center">
            <button
              onClick={() => setShowModal(true)}
              disabled={isSharing}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {isSharing ? 'Preparing...' : '📤 Share Meme'}
            </button>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isDownloading ? 'Downloading...' : '📥 Download Meme'}
            </button>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-md text-center space-y-4">
            <h2 className="text-2xl font-bold">🎉 Meme Ready to Share!</h2>
            <p className="text-gray-600">Share your meme with friends!</p>

            <div className="flex justify-center gap-4">
              <button 
                onClick={shareWhatsApp} 
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                WhatsApp
              </button>
              <button 
                onClick={shareFacebook} 
                className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900 transition"
              >
                Facebook
              </button>
              <button 
                onClick={shareTwitter} 
                className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500 transition"
              >
                Twitter
              </button>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Or copy this link:</p>
              <div className="flex">
                <input
                  type="text"
                  readOnly
                  value={getMemeShareUrl()}
                  className="flex-1 px-2 py-1 border rounded-l text-sm"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(getMemeShareUrl());
                    alert('Link copied to clipboard!');
                  }}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-r text-sm"
                >
                  Copy
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 text-sm text-gray-500 hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemeEditor; 