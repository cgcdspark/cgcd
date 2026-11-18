@echo off
REM Rebuilds the full-quality master MP4 from its 8 parts (GitHub limits files to 100 MB).
cd /d "%~dp0"
copy /b "THE_BIG_PICTURE_EP01_The_Hidden_Winners_of_the_AI_Boom.mp4.part00"+"THE_BIG_PICTURE_EP01_The_Hidden_Winners_of_the_AI_Boom.mp4.part01"+"THE_BIG_PICTURE_EP01_The_Hidden_Winners_of_the_AI_Boom.mp4.part02"+"THE_BIG_PICTURE_EP01_The_Hidden_Winners_of_the_AI_Boom.mp4.part03"+"THE_BIG_PICTURE_EP01_The_Hidden_Winners_of_the_AI_Boom.mp4.part04"+"THE_BIG_PICTURE_EP01_The_Hidden_Winners_of_the_AI_Boom.mp4.part05"+"THE_BIG_PICTURE_EP01_The_Hidden_Winners_of_the_AI_Boom.mp4.part06"+"THE_BIG_PICTURE_EP01_The_Hidden_Winners_of_the_AI_Boom.mp4.part07" "..\THE_BIG_PICTURE_EP01_The_Hidden_Winners_of_the_AI_Boom.mp4"
echo Done. Expected SHA-256: 1252dffebc392682b8ae61d7090bc6b419fe5e15a350be14c154d9d048faf7ff
pause
