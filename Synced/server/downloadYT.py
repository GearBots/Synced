import os
from pytube import YouTube
from moviepy.editor import AudioFileClip
from pytube.exceptions import PytubeError

def download_yt(video_url, output_path='./', download_type='audio', delete_orig=False):
    try:
        video = YouTube(video_url)
        if download_type == 'audio':
            audio_stream = video.streams.get_audio_only()
        else:
            raise ValueError('Invalid Download Type')
        if not audio_stream:
            raise ValueError('No Audio Stream Found')
        
        download_path = audio_stream.download(output_path=output_path)

        if download_type == 'audio':
            base_name = os.path.splitext(os.path.basename(download_path))[0]
            base_name = base_name.replace(' ', '_')
            mp3_file = os.path.join(output_path, f"{base_name}.mp3")

            with AudioFileClip(download_path) as clip:
                clip.write_audiofile(mp3_file)

            if delete_orig and os.path.exists(download_path):
                os.remove(download_path)

            return mp3_file 
    except PytubeError as e:
        print(f"A Pytube error occurred: {e}")
        raise
    except ValueError as e:
        print(f"A ValueError occurred: {e}")
        raise

if __name__ == '__main__':
    video_url = input("Enter YouTube video URL: ")
    download_yt(video_url)
