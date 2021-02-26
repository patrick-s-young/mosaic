import { 
  createAsyncThunk
} from '@reduxjs/toolkit';

export const preUploadValidation = createAsyncThunk(
  'api/preUploadValidation',
  async (event) => {

    const selectedFile = event.target.files[0];
    const uploadDuration = await new Promise<number>((_resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function(evt) {
        const blob: Blob = new Blob( [ evt.target.result ], { type: "video/mp4" } );
        const urlCreator = window.URL || window.webkitURL;
        var videoUrl = urlCreator.createObjectURL( blob );
        var video = document.createElement('video');
        video.src = videoUrl;
        video.addEventListener('loadedmetadata', (ev: Event) => {
          const target = ev.currentTarget as HTMLVideoElement;
          console.log(`duration: ${target.duration}`);
          urlCreator.revokeObjectURL(videoUrl);
          _resolve(target.duration);
          //dispatch(setVideoSubmitted({ selectedFile, uploadDuration: target.duration }));
          //return { selectedFile, uploadDuration: target.duration }
        });
      }
      // read file to determine if duration is not too long (less than fifteen seconds)
      reader.readAsArrayBuffer(selectedFile);
    });

    return { selectedFile, uploadDuration };
  }
);