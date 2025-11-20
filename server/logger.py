import logging
import os

LOG_DIR = "logs"
os.makedirs(LOG_DIR, exist_ok=True)

LOG_FILE = os.path.join(LOG_DIR, "server.log")

logger = logging.getLogger("server_logger")
logger.setLevel(logging.INFO)

formatter = logging.Formatter("[%(asctime)s] [%(name)s] [%(levelname)s] %(message)s",
                              datefmt="%Y-%m-%d %H:%M:%S")

file_handler = logging.FileHandler(LOG_FILE, encoding="utf-8")
file_handler.setFormatter(formatter)
logger.addHandler(file_handler)