import { useState } from 'react';
import './App.css';
import VideoPlayer from './components/VideoPlayer';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  const handlePlayButtonClick = () => setIsPlaying(!isPlaying);
  const videoUrl = 'https://www.w3schools.com/html/mov_bbb.mp4';

  return (
    <div className='App'>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={handlePlayButtonClick}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer isPlaying={isPlaying} src={videoUrl} />
    </div>
  );
}

export default App;
