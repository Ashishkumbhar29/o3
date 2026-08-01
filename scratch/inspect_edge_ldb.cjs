const fs = require('fs');
const path = require('path');

const filePath = `C:\\Users\\ashis\\AppData\\Local\\Microsoft\\Edge\\User Data\\Default\\Local Storage\\leveldb\\000138.ldb`;
const buf = fs.readFileSync(filePath);
const str = buf.toString('utf8');

console.log('File size:', buf.length);

const keyIndex = str.indexOf('gir_love_app_data');
if (keyIndex !== -1) {
  console.log('Found key index at:', keyIndex);
  const chunk = str.substring(keyIndex, keyIndex + 3000);
  console.log('Chunk preview:\n', chunk);
} else {
  console.log('Key not found directly with utf8, searching binary...');
  const binStr = buf.toString('binary');
  const kIdx = binStr.indexOf('gir_love_app_data');
  if (kIdx !== -1) {
    console.log('Found binary key index at:', kIdx);
    console.log('Binary chunk preview:\n', binStr.substring(kIdx, kIdx + 1000));
  }
}
