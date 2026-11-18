@echo off
REM Rebuilds the full-quality master MP4 from its 7 parts (GitHub limits files to 100 MB).
cd /d "%~dp0"
copy /b "THE_BIG_PICTURE_EP02_Nvidia_After_Jensen.mp4.part00"+"THE_BIG_PICTURE_EP02_Nvidia_After_Jensen.mp4.part01"+"THE_BIG_PICTURE_EP02_Nvidia_After_Jensen.mp4.part02"+"THE_BIG_PICTURE_EP02_Nvidia_After_Jensen.mp4.part03"+"THE_BIG_PICTURE_EP02_Nvidia_After_Jensen.mp4.part04"+"THE_BIG_PICTURE_EP02_Nvidia_After_Jensen.mp4.part05"+"THE_BIG_PICTURE_EP02_Nvidia_After_Jensen.mp4.part06" "..\THE_BIG_PICTURE_EP02_Nvidia_After_Jensen.mp4"
echo Done. Expected SHA-256: f921742f50b60e5a8c68ffd75805be7591112fe5ca4ffe8ed41c543b05c849e3
pause
