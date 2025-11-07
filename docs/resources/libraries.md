---
title: Python Libraries
---

# Python Libraries

This page highlights high‑quality, widely used libraries. Start with the Standard Library essentials, then explore popular third‑party packages by category.

## Standard Library essentials

- Built‑ins (functions, types)
  - https://docs.python.org/3/library/functions.html
  - https://docs.python.org/3/library/stdtypes.html
- `itertools` – fast iterator building blocks
  - https://docs.python.org/3/library/itertools.html
- `functools` – higher‑order functions, caching (`lru_cache`)
  - https://docs.python.org/3/library/functools.html
- `collections` / `collections.abc` – deque, Counter, defaultdict, protocols
  - https://docs.python.org/3/library/collections.html
- `pathlib` – modern filesystem paths
  - https://docs.python.org/3/library/pathlib.html
- `datetime` / `zoneinfo` – dates, times, time zones
  - https://docs.python.org/3/library/datetime.html
  - https://docs.python.org/3/library/zoneinfo.html
- `math` / `statistics` / `random` – numerics and statistics
  - https://docs.python.org/3/library/math.html
  - https://docs.python.org/3/library/statistics.html
  - https://docs.python.org/3/library/random.html
- `json` / `csv` – common data formats
  - https://docs.python.org/3/library/json.html
  - https://docs.python.org/3/library/csv.html
- `argparse` – command‑line parsing
  - https://docs.python.org/3/library/argparse.html
- `logging` – application logging
  - https://docs.python.org/3/library/logging.html
- `subprocess` – run external commands safely
  - https://docs.python.org/3/library/subprocess.html
- `typing` / `dataclasses` – static types and data models
  - https://docs.python.org/3/library/typing.html
  - https://docs.python.org/3/library/dataclasses.html
- `unittest` / `doctest` – testing frameworks
  - https://docs.python.org/3/library/unittest.html
  - https://docs.python.org/3/library/doctest.html
- `re` – regular expressions
  - https://docs.python.org/3/library/re.html
- `urllib.request` / `urllib.parse` – basic HTTP, URL parsing
  - https://docs.python.org/3/library/urllib.request.html
  - https://docs.python.org/3/library/urllib.parse.html

## Third‑party essentials (by category)

### HTTP & Web
- Requests – human‑friendly HTTP for sync code
  - https://requests.readthedocs.io/
- HTTPX – modern HTTP client, sync/async
  - https://www.python-httpx.org/

### Data & Numerics
- NumPy – fundamental array library
  - https://numpy.org/
- Pandas – data analysis with DataFrame API
  - https://pandas.pydata.org/
- Polars – fast DataFrames (Rust‑backed)
  - https://pola.rs/

### Visualization
- Matplotlib – foundational plotting
  - https://matplotlib.org/
- Seaborn – statistical graphics
  - https://seaborn.pydata.org/
- Plotly – interactive charts
  - https://plotly.com/python/

### Web frameworks & APIs
- Flask – micro web framework
  - https://flask.palletsprojects.com/
- FastAPI – modern, type‑hinted APIs
  - https://fastapi.tiangolo.com/
- Django – batteries‑included web framework
  - https://www.djangoproject.com/

### CLI & UX
- Click – composable CLIs
  - https://click.palletsprojects.com/
- Typer – CLIs with type hints (on Click)
  - https://typer.tiangolo.com/
- Rich – beautiful terminal formatting
  - https://rich.readthedocs.io/

### Data validation & parsing
- Pydantic – typed models and validation
  - https://docs.pydantic.dev/
- Marshmallow – schema‑based serialization
  - https://marshmallow.readthedocs.io/
- Beautiful Soup – HTML parsing/scraping
  - https://www.crummy.com/software/BeautifulSoup/bs4/doc/

### Databases & ORMs
- SQLite (std lib `sqlite3`) – embedded DB
  - https://docs.python.org/3/library/sqlite3.html
- SQLAlchemy – DB toolkit/ORM
  - https://www.sqlalchemy.org/
- Alembic – DB migrations for SQLAlchemy
  - https://alembic.sqlalchemy.org/

### Testing & Quality
- pytest – the go‑to test framework
  - https://docs.pytest.org/
- Hypothesis – property‑based testing
  - https://hypothesis.readthedocs.io/
- Black – uncompromising code formatter
  - https://black.readthedocs.io/
- Ruff – fast linter
  - https://docs.astral.sh/ruff/
- mypy – static type checker
  - https://mypy.readthedocs.io/

### Notebooks & docs
- JupyterLab / Notebook
  - https://jupyter.org/
- Sphinx – documentation generator
  - https://www.sphinx-doc.org/

For more, browse Awesome Python:
- https://github.com/vinta/awesome-python
