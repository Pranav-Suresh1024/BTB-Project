from fastapi import FastAPI, HTTPException
from engine.indexer import build_index
from engine.search import search
import subprocess
import os

app = FastAPI(title="Git Repository Search API")

BASE_REPO_DIR = "repos"
INDEX = None
CURRENT_REPO = None


def clone_repo(repo_url: str) -> str:
    """
    Clone repo if not already cloned.
    Returns local repo path.
    """
    os.makedirs(BASE_REPO_DIR, exist_ok=True)

    repo_name = repo_url.rstrip("/").split("/")[-1]
    if repo_name.endswith(".git"):
        repo_name = repo_name[:-4]

    repo_path = os.path.join(BASE_REPO_DIR, repo_name)

    if not os.path.exists(repo_path):
        try:
            subprocess.run(
                ["git", "clone", repo_url, repo_path],
                check=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
            )
        except subprocess.CalledProcessError as e:
            raise HTTPException(status_code=400, detail=e.stderr)

    return repo_path


@app.post("/index")
def index_repository(repo_url: str):
    """
    Paste GitHub repo URL here.
    """
    global INDEX, CURRENT_REPO

    repo_path = clone_repo(repo_url)

    INDEX = build_index(repo_path)
    CURRENT_REPO = repo_url

    return {
        "message": "Repository indexed successfully",
        "repository": repo_url,
        "files_indexed": len(INDEX)
    }


@app.get("/search")
def search_repository(q: str):
    if INDEX is None:
        raise HTTPException(
            status_code=400,
            detail="No repository indexed yet"
        )

    results = search(INDEX, q)

    return {
        "repository": CURRENT_REPO,
        "query": q,
        "count": len(results),
        "results": results
    }
