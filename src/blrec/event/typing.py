from typing import Union


from .models import (
    LiveBeganEvent,
    LiveBeganEventData,
    LiveEndedEvent,
    LiveEndedEventData,
    RoomChangeEvent,
    RoomChangeEventData,
    RecordingStartedEvent,
    RecordingStartedEventData,
    RecordingFinishedEvent,
    RecordingFinishedEventData,
    RecordingCancelledEvent,
    RecordingCancelledEventData,
    VideoFileCreatedEvent,
    VideoFileCreatedEventData,
    VideoFileCompletedEvent,
    VideoFileCompletedEventData,
    CoverImageDownloadedEvent,
    CoverImageDownloadedEventData,
    VideoPostprocessingCompletedEvent,
    VideoPostprocessingCompletedEventData,
    PostprocessingCompletedEvent,
    PostprocessingCompletedEventData,
    SpaceNoEnoughEvent,
    SpaceNoEnoughEventData,
    Error,
    ErrorData,
)


Event = Union[
    LiveBeganEvent,
    LiveEndedEvent,
    RoomChangeEvent,
    RecordingStartedEvent,
    RecordingFinishedEvent,
    RecordingCancelledEvent,
    VideoFileCreatedEvent,
    VideoFileCompletedEvent,
    CoverImageDownloadedEvent,
    VideoPostprocessingCompletedEvent,
    PostprocessingCompletedEvent,
    SpaceNoEnoughEvent,
    Error,
]

EventData = Union[
    LiveBeganEventData,
    LiveEndedEventData,
    RoomChangeEventData,
    RecordingStartedEventData,
    RecordingFinishedEventData,
    RecordingCancelledEventData,
    VideoFileCreatedEventData,
    VideoFileCompletedEventData,
    CoverImageDownloadedEventData,
    VideoPostprocessingCompletedEventData,
    PostprocessingCompletedEventData,
    SpaceNoEnoughEventData,
    ErrorData,
]
