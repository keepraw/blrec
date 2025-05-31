import os
import re
from pathlib import PurePath

__all__ = (
    'cover_path',
    'create_file',
    'playlist_path',
    'escape_path',
    'extra_metadata_path',
    'ffmpeg_metadata_path',
    'record_metadata_path',
    'file_exists',
)


def file_exists(path: str) -> bool:
    return os.path.isfile(path)


def create_file(path: str) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'x'):
        pass


def playlist_path(video_path: str) -> str:
    return str(PurePath(video_path).with_suffix('.m3u8'))


def video_path(playlist_path: str) -> str:
    return str(PurePath(playlist_path).with_suffix('.m4s'))


def cover_path(video_path: str, ext: str = 'jpg') -> str:
    return str(PurePath(video_path).with_suffix('.' + ext))


def extra_metadata_path(video_path: str) -> str:
    return video_path + '.meta.json'


def record_metadata_path(video_path: str) -> str:
    return str(PurePath(video_path).with_suffix('.meta.json'))


def ffmpeg_metadata_path(video_path: str) -> str:
    return video_path + '.meta'


def escape_path(path: str) -> str:
    return re.sub(r'[\\/:*?"<>|]', '', path)
