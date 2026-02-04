from difflib import SequenceMatcher
from typing import List

from .types import IndexType


def fuzzy_score(a: str, b: str) -> float:
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()


def search(index: IndexType, query: str, limit: int = 20):

    scored: List[tuple[float, int]] = []

    for fid, record in index.items():
        best = 0.0

        for entry in record["entries"]:
            s = fuzzy_score(query, entry["path"])
            best = max(best, s)

        if best > 0.3:
            scored.append((best, fid))

    scored.sort(reverse=True)

    results = []

    for score, fid in scored[:limit]:
        results.append(
            {
                "score": round(score, 3),
                "history": index[fid]["entries"],
            }
        )

    return results
