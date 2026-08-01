const fs = require('fs');
const path = require('path');

const EDGE_DB_DIR = `C:\\Users\\ashis\\AppData\\Local\\Microsoft\\Edge\\User Data\\Default\\IndexedDB\\http_localhost_3000.indexeddb.leveldb`;
const MEDIA_DIR = path.join(__dirname, '..', 'public', 'media');

if (!fs.existsSync(MEDIA_DIR)) {
  fs.mkdirSync(MEDIA_DIR, { recursive: true });
}

console.log('Reading LevelDB files from:', EDGE_DB_DIR);

if (!fs.existsSync(EDGE_DB_DIR)) {
  console.error('Edge IndexedDB directory not found!');
  process.exit(1);
}

const files = fs.readdirSync(EDGE_DB_DIR);
console.log('Found DB files:', files);

let combinedBuffer = Buffer.alloc(0);

files.forEach(f => {
  const fullPath = path.join(EDGE_DB_DIR, f);
  if (fs.statSync(fullPath).isFile()) {
    try {
      const data = fs.readFileSync(fullPath);
      combinedBuffer = Buffer.concat([combinedBuffer, data]);
    } catch (e) {
      console.warn('Could not read file:', f, e.message);
    }
  }
});

const strContent = combinedBuffer.toString('binary');
console.log('Total DB buffer binary length:', strContent.length);

// Regex matching base64 data URLs for video and audio
const dataUrlRegex = /data:(video\/[^;]+|audio\/[^;]+);base64,([A-Za-z0-9+/=]+)/g;

let match;
let count = 0;
let songCount = 0;
let videoCount = 0;
const manifest = { songUrl: null, videos: [] };

while ((match = dataUrlRegex.exec(strContent)) !== null) {
  count++;
  const mime = match[1];
  const base64Str = match[2];

  // Ignore tiny snippets
  if (base64Str.length < 5000) continue;

  console.log(`Found match ${count}: mime=${mime}, length=${base64Str.length}`);

  const buffer = Buffer.from(base64Str, 'base64');

  if (mime.startsWith('audio')) {
    songCount++;
    const songName = `song1.mp3`;
    const songPath = path.join(MEDIA_DIR, songName);
    fs.writeFileSync(songPath, buffer);
    manifest.songUrl = `/media/${songName}`;
    console.log(`Successfully saved audio to public/media/${songName} (${buffer.length} bytes)`);
  } else if (mime.startsWith('video')) {
    videoCount++;
    const videoName = `video${videoCount}.mp4`;
    const videoPath = path.join(MEDIA_DIR, videoName);
    fs.writeFileSync(videoPath, buffer);
    
    manifest.videos.push({
      id: `vid-${videoCount}`,
      title: `Personal Video ${videoCount}`,
      videoUrl: `/media/${videoName}`,
      videoThumbnail: '',
      caption: 'Our special personal video memory.'
    });
    console.log(`Successfully saved video to public/media/${videoName} (${buffer.length} bytes)`);
  }
}

// Fallback search for raw video/MP4 signatures if base64 chunked
if (videoCount === 0 || !manifest.songUrl) {
  console.log('Searching for secondary base64 patterns...');
  // Find all substrings containing "data:video" or "data:audio"
  let idx = 0;
  while ((idx = strContent.indexOf('data:', idx)) !== -1) {
    const snippet = strContent.substring(idx, idx + 100);
    if (snippet.includes('video/') || snippet.includes('audio/')) {
      const endIdx = strContent.indexOf('"', idx);
      const endIdx2 = strContent.indexOf("'", idx);
      const endIdx3 = strContent.indexOf('\\', idx);
      let validEnd = [endIdx, endIdx2, endIdx3].filter(x => x > idx).sort((a,b)=>a-b)[0] || (idx + 1000000);
      
      const fullUrl = strContent.substring(idx, validEnd);
      const subMatches = fullUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (subMatches) {
        const subMime = subMatches[1];
        const subB64 = subMatches[2];
        const subBuf = Buffer.from(subB64, 'base64');
        if (subMime.startsWith('audio') && !manifest.songUrl) {
          fs.writeFileSync(path.join(MEDIA_DIR, 'song1.mp3'), subBuf);
          manifest.songUrl = '/media/song1.mp3';
          console.log('Fallback extracted song1.mp3');
        } else if (subMime.startsWith('video')) {
          videoCount++;
          const vName = `video${videoCount}.mp4`;
          fs.writeFileSync(path.join(MEDIA_DIR, vName), subBuf);
          manifest.videos.push({
            id: `vid-${videoCount}`,
            title: `Personal Video ${videoCount}`,
            videoUrl: `/media/${vName}`,
            videoThumbnail: '',
            caption: 'Our special personal video memory.'
          });
          console.log(`Fallback extracted ${vName}`);
        }
      }
    }
    idx += 5;
  }
}

fs.writeFileSync(path.join(MEDIA_DIR, 'media_manifest.json'), JSON.stringify(manifest, null, 2));
console.log('Extraction complete! Manifest:', manifest);
