const video=document.getElementById('video');
video.addEventListener('error',()=>{document.getElementById('playback-status').textContent='영상을 불러오지 못했습니다. 아래 ‘영상 파일 열기’를 눌러 다시 시도해 주세요.';});
video.querySelector('source').addEventListener('error',()=>{document.getElementById('playback-status').textContent='영상을 불러오지 못했습니다. 아래 ‘영상 파일 열기’를 눌러 다시 시도해 주세요.';});
