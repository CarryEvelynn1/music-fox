const path = require('path');

function resolveFfmpegPath() {
  
  if (process.env.FFMPEG_PATH && process.env.FFMPEG_PATH.trim()) {
    return { path: process.env.FFMPEG_PATH, source: 'FFMPEG_PATH (env)' };
  }
  
  try {
    const staticPath = require('ffmpeg-static');
    if (staticPath) return { path: staticPath, source: 'ffmpeg-static' };
  } catch (_) {}
  
  try {
    const installer = require('@ffmpeg-installer/ffmpeg');
    if (installer && installer.path) {
      return { path: installer.path, source: '@ffmpeg-installer/ffmpeg' };
    }
  } catch (_) {}
  return { path: null, source: null };
}

(function run() {
  const { path: ffpath, source } = resolveFfmpegPath();
  console.log('--------------------------------------------------');
  console.log('By Fox Logic: Outsmart Everyone.');
  console.log('--------------------------------------------------');
  
  if (ffpath) {
    console.log(`[Kurulum] FFmpeg başarıyla bulundu (${source}): ${ffpath}`);
    console.log('Fox Music ses sistemleri kullanıma hazır!');
  } else {
    console.warn('[Uyarı] FFmpeg bulunamadı! Bot çalışmaya devam edebilir ancak ses çalma işlemleri hata verecektir.');
    console.warn('Lütfen .env dosyasına FFMPEG_PATH ekleyin veya şu paketlerden birini kurun: ffmpeg-static, @ffmpeg-installer/ffmpeg');
  }
  console.log('--------------------------------------------------');
})();
