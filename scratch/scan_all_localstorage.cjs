const fs = require('fs');
const path = require('path');

const MEDIA_DIR = path.join(__dirname, '..', 'public', 'media');
if (!fs.existsSync(MEDIA_DIR)) {
  fs.mkdirSync(MEDIA_DIR, { recursive: true });
}

const dirsToScan = [
  `C:\\Users\\ashis\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Local Storage\\leveldb`,
  `C:\\Users\\ashis\\AppData\\Local\\Microsoft\\Edge\\User Data\\Default\\Local Storage\\leveldb`,
  `C:\\Users\\ashis\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\IndexedDB`,
  `C:\\Users\\ashis\\AppData\\Local\\Microsoft\\Edge\\User Data\\Default\\IndexedDB`
];

// Helper to recursively collect files
function getAllFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(full));
    } else {
      results.push(full);
    }
  });
  return results;
}

let manifest = { songUrl: null, videos: [] };
let songCount = 0;
let videoCount = 0;

dirsToScan.forEach(dir => {
  console.log('--- Scanning:', dir);
  const files = getAllFiles(dir);

  files.forEach(filePath => {
    if (!filePath.endsWith('.ldb') && !filePath.endsWith('.log')) return;
    try {
      const dataBuf = fs.readFileSync(filePath);
      const str = dataBuf.toString('binary');

      // Search for gir_love_app_data_v3 or base64 data URLs
      if (str.includes('gir_love_app_data') || str.includes('data:audio') || str.includes('data:video') || str.includes('bgMusicUrl')) {
        console.log(`Found relevant keywords in: ${filePath} (Size: ${dataBuf.length})`);

        // Search for data URLs
        const regex = /data:(video\/[^;]+|audio\/[^;]+);base64,([A-Za-z0-9+/=]+)/g;
        let match;
        while ((match = regex.exec(str)) !== null) {
          const mime = match[1];
          const b64 = match[2];
          if (b64.length < 1000) continue;

          console.log(`Found Data URL match! Mime: ${mime}, B64 length: ${b64.length}`);
          const buf = Buffer.from(b64, 'base64');

          if (mime.startsWith('audio') && !manifest.songUrl) {
            songCount++;
            const sName = 'song1.mp3';
            fs.writeFileSync(path.join(MEDIA_DIR, sName), buf);
            manifest.songUrl = `/media/${sName}`;
            console.log(`Saved extracted audio -> public/media/${sName}`);
          } else if (mime.startsWith('video')) {
            videoCount++;
            const vName = `video${videoCount}.mp4`;
            fs.writeFileSync(path.join(MEDIA_DIR, vName), buf);
            manifest.videos.push({
              id: `vid-${videoCount}`,
              title: `Personal Video ${videoCount}`,
              videoUrl: `/media/${vName}`,
              videoThumbnail: '',
              caption: 'Our special personal video memory.'
            });
            console.log(`Saved extracted video -> public/media/${vName}`);
          }
        }

        // Secondary search for JSON objects containing bgMusicUrl or videos
        let pos = 0;
        while ((pos = str.indexOf('{', pos)) !== -1) {
          const endPos = str.indexOf('}', pos);
          if (endPos > pos && endPos - pos < 5000000) {
            const candidate = str.substring(pos, endPos + 1);
            if (candidate.includes('bgMusicUrl') || candidate.includes('slideshowPhotos') || candidate.includes('partner1')) {
              console.log('Found app JSON candidate string length:', candidate.length);
              try {
                // Clean non-printable chars
                const cleanJson = candidate.replace(/[\x00-\x1F\x7F-\xFF]/g, '');
                const parsed = JSON.parse(cleanJson);
                console.log('Successfully parsed app state JSON!');
                if (parsed.bgMusicUrl && parsed.bgMusicUrl.startsWith('data:') && !manifest.songUrl) {
                  const m = parsed.bgMusicUrl.match(/^data:([^;]+);base64,(.+)$/);
                  if (m) {
                    const buf = Buffer.from(m[2], 'base64');
                    fs.writeFileSync(path.join(MEDIA_DIR, 'song1.mp3'), buf);
                    manifest.songUrl = '/media/song1.mp3';
                    console.log('Parsed JSON -> saved song1.mp3');
                  }
                }
              } catch {}
            }
          }
          pos += 1;
        }
      }
    } catch (e) {
      // Ignore file lock or read issues
    }
  });
});

fs.writeFileSync(path.join(MEDIA_DIR, 'media_manifest.json'), JSON.stringify(manifest, null, 2));
console.log('\n=== FINAL EXTRACTION MANIFEST ===\n', manifest);
