from typing import TypedDict, List


class PathEntry(TypedDict):
    commit: str
    timestamp: int
    path: str


class FileHistory(TypedDict):
    id: int
    entries: List[PathEntry]


IndexType = dict[int, FileHistory]
