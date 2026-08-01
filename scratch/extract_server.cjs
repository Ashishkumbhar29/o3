const http = require('http');
const fs = require('fs');
const path = require('path');

const MEDIA_DIR = path.join(__dirname, '..', 'public', 'media');

if (!fs.existsSync(MEDIA_DIR)) {
  fs.mkdirSync(MEDIA_DIR, { recursive: true });
}

function dataUrlToBuffer(dataUrl) {
  if (!dataUrl || typeof dataUrl !== 'string') return null;
  const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (matches && matches[2]) {
    return Buffer.from(matches[2], 'base64');
  }
  try {
    return Buffer.from(dataUrl, 'base64');
  } catch {
    return null;
  }
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/save-media') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const manifest = { songUrl: null, videos: [] };

        // Process Song
        if (payload.song) {
          const songBuf = dataUrlToBuffer(payload.song);
          if (songBuf) {
            const songPath = path.join(MEDIA_DIR, 'song1.mp3');
            fs.writeFileSync(songPath, songBuf);
            manifest.songUrl = '/media/song1.mp3';
            console.log('Saved song to public/media/song1.mp3');
          }
        }

        // Process Videos
        if (Array.isArray(payload.videos) && payload.videos.length > 0) {
          payload.videos.forEach((vid, idx) => {
            const vNum = idx + 1;
            let vUrl = vid.videoUrl;
            let vThumb = vid.videoThumbnail;

            if (vUrl && vUrl.startsWith('data:')) {
              const vBuf = dataUrlToBuffer(vUrl);
              if (vBuf) {
                const vFileName = `video${vNum}.mp4`;
                fs.writeFileSync(path.join(MEDIA_DIR, vFileName), vBuf);
                vUrl = `/media/${vFileName}`;
                console.log(`Saved video to public/media/${vFileName}`);
              }
            }

            if (vThumb && vThumb.startsWith('data:')) {
              const tBuf = dataUrlToBuffer(vThumb);
              if (tBuf) {
                const tFileName = `video${vNum}_thumb.jpg`;
                fs.writeFileSync(path.join(MEDIA_DIR, tFileName), tBuf);
                vThumb = `/media/${tFileName}`;
                console.log(`Saved thumbnail to public/media/${tFileName}`);
              }
            }

            manifest.videos.push({
              id: vid.id || `vid-${vNum}`,
              title: vid.title || `Personal Video ${vNum}`,
              videoUrl: vUrl,
              videoThumbnail: vThumb || '',
              caption: vid.caption || 'Our special personal video memory.'
            });
          });
        }

        fs.writeFileSync(path.join(MEDIA_DIR, 'media_manifest.json'), JSON.stringify(manifest, null, 2));
        console.log('Manifest written successfully:', manifest);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, manifest }));
      } catch (err) {
        console.error('Error processing media payload:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(3001, () => {
  console.log('Media Extractor Server listening on http://localhost:3001');
});
