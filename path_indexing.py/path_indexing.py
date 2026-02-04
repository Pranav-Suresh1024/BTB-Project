import subprocess
import sys
from collections import defaultdict
from difflib import SequenceMatcher

# -----------------------------
# git helpers
# -----------------------------

def run_git(args):
    result = subprocess.run(
        ["git"] + args,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip())
    return result.stdout.strip()


def get_commits_oldest_first(limit=None):
    out = run_git(["rev-list", "--reverse", "HEAD", "--timestamp"])
    commits = []
    for line in out.splitlines():
        ts, sha = line.split()
        commits.append((sha, int(ts)))
    return commits[:limit] if limit else commits


# -----------------------------
# fuzzy
# -----------------------------

def fuzzy_score(a, b):
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()


# -----------------------------
# indexing with rename tracking
# -----------------------------

def build_index(limit=None):
    commits = get_commits_oldest_first(limit)

    print(f"Indexing {len(commits)} commits...")

    path_to_id = {}
    next_id = 1

    history = defaultdict(list)

    prev_sha = None

    for i, (sha, ts) in enumerate(commits, 1):
        print(f"[{i}/{len(commits)}] {sha[:8]}")

        if prev_sha is None:
            # first commit: full tree
            out = run_git(["ls-tree", "-r", "--name-only", sha])
            for p in out.splitlines():
                fid = next_id
                next_id += 1
                path_to_id[p] = fid
                history[fid].append((sha, ts, p))
        else:

            diff = run_git(
                ["diff", "--name-status", "-M20%", "-C", prev_sha, sha]
            )

            for line in diff.splitlines():
                parts = line.split("\t")

                status = parts[0]

                # rename: R100 old new
                if status.startswith("R"):
                    old, new = parts[1], parts[2]
                    fid = path_to_id.pop(old, None)
                    if fid is None:
                        fid = next_id
                        next_id += 1
                    path_to_id[new] = fid
                    history[fid].append((sha, ts, new))

                elif status == "A":
                    p = parts[1]
                    fid = next_id
                    next_id += 1
                    path_to_id[p] = fid
                    history[fid].append((sha, ts, p))

                elif status == "D":
                    p = parts[1]
                    path_to_id.pop(p, None)

                elif status == "M":
                    # path unchanged → nothing to do for name indexing
                    pass

        prev_sha = sha

    print("Indexing complete.")
    return history


# -----------------------------
# querying
# -----------------------------

def search(history, query, limit=20):
    scored = []

    for fid, entries in history.items():
        best = 0.0
        for _, _, path in entries:
            s = fuzzy_score(query, path)
            best = max(best, s)

        if best > 0.3:
            scored.append((best, fid))

    scored.sort(reverse=True)

    results = []
    for score, fid in scored[:limit]:
        results.append((score, fid, history[fid]))

    return results

# -----------------------------
# main
# -----------------------------

def main():
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python path_history_with_renames.py <query> [commit_limit]")
        sys.exit(1)

    query = sys.argv[1]
    limit = int(sys.argv[2]) if len(sys.argv) > 2 else None

    history = build_index(limit)

    results = search(history, query)

    print("\nResults:\n")

    for score, fid, entries in results:
        print(f"(score={score:.2f})")
        for sha, ts, path in entries:
            print(f"  {sha[:8]}  {path}")
        print()


if __name__ == "__main__":
    main()
