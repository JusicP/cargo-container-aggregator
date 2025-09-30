import os
import sys
import subprocess
from pathlib import Path

# project root
ROOT = Path(__file__).resolve().parent.parent.parent

# push project root path to PYTHONPATH
env = dict(**os.environ)
env["PYTHONPATH"] = str(ROOT)

OUTPUT = ROOT / "docs" / "models.md"

# declarative base class path
BASE = "server.database.connection:Base"

# path to models
IMPORTS = "server.models"

cmd = [
    "paracelsus",
    "graph",
    BASE,
    "--import-module", IMPORTS,
    "--format", "mermaid",
]

proc = subprocess.run(cmd, capture_output=True, text=True, env=env)
if proc.returncode != 0:
    print("paracelsus run error:\n", proc.stderr)
    sys.exit(proc.returncode)

mermaid = proc.stdout.strip()

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
with open(OUTPUT, "w", encoding="utf-8") as f:
    f.write("# ER діаграма\n")
    f.write("```mermaid\n")
    f.write(mermaid)
    f.write("\n```\n")

print(f"ER-diagram saved to {OUTPUT}")
