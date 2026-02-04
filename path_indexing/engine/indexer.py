from collections import defaultdict
from typing import Dict

from .git_runner import run_git
from .types import IndexType


def get_commits_oldest_first(repo_path: str):
    out = run_git(
        ["rev-list", "--reverse", "HEAD", "--timestamp"],
        cwd=repo_path,
    )

    commits = []
    for line in out.splitlines():
        ts, sha = line.split()
        commits.append((sha, int(ts)))

    return commits


def build_index(repo_path: str) -> IndexType:
    commits = get_commits_oldest_first(repo_path)

    path_to_id: dict[str, int] = {}
    next_id = 1

    history: Dict[int, dict] = defaultdict(
        lambda: {"id": None, "entries": []}
    )

    prev_sha = None

    for sha, ts in commits:

        if prev_sha is None:
            out = run_git(
                ["ls-tree", "-r", "--name-only", sha],
                cwd=repo_path,
            )

            for p in out.splitlines():
                fid = next_id
                next_id += 1

                path_to_id[p] = fid
                history[fid]["id"] = fid
                history[fid]["entries"].append(
                    {
                        "commit": sha,
                        "timestamp": ts,
                        "path": p,
                    }
                )

        else:
            diff = run_git(
                [
                    "diff",
                    "--name-status",
                    "-M20%",
                    "-C",
                    prev_sha,
                    sha,
                ],
                cwd=repo_path,
            )

            for line in diff.splitlines():
                parts = line.split("\t")
                status = parts[0]

                if status.startswith("R"):
                    old, new = parts[1], parts[2]

                    fid = path_to_id.pop(old, None)
                    if fid is None:
                        fid = next_id
                        next_id += 1

                    path_to_id[new] = fid
                    history[fid]["id"] = fid
                    history[fid]["entries"].append(
                        {
                            "commit": sha,
                            "timestamp": ts,
                            "path": new,
                        }
                    )

                elif status == "A":
                    p = parts[1]

                    fid = next_id
                    next_id += 1

                    path_to_id[p] = fid
                    history[fid]["id"] = fid
                    history[fid]["entries"].append(
                        {
                            "commit": sha,
                            "timestamp": ts,
                            "path": p,
                        }
                    )

                elif status == "D":
                    p = parts[1]
                    path_to_id.pop(p, None)

        prev_sha = sha

    return history
