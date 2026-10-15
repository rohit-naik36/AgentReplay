"""Token cost accounting.

Prices are NOT bundled: provider prices change, and a wrong built-in number
would silently produce wrong dollars. Supply them via a JSON file whose path
is in AGENTREPLAY_PRICES_FILE, shaped like prices.example.json
(USD per 1M tokens). A model with no configured price gets cost_usd = None.
"""
import json
import os
from typing import Dict, Optional

# Weighting used in the TokenOpt n8n benchmark (cost proxy when dollars are unknown):
# uncached input x1, cache read x0.1, output x4.
W_INPUT, W_CACHE_READ, W_OUTPUT = 1.0, 0.1, 4.0


def load_prices() -> Dict[str, Dict[str, float]]:
    path = os.environ.get("AGENTREPLAY_PRICES_FILE")
    if not path or not os.path.exists(path):
        return {}
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def compute_cost_usd(
    model: Optional[str],
    input_tokens: Optional[int],
    output_tokens: Optional[int],
    cache_read_tokens: Optional[int] = None,
    prices: Optional[Dict[str, Dict[str, float]]] = None,
) -> Optional[float]:
    if not model or (input_tokens is None and output_tokens is None):
        return None
    price = (prices if prices is not None else load_prices()).get(model)
    if not price:
        return None
    per_m = 1_000_000
    cost = (
        (input_tokens or 0) * price["input_per_mtok"]
        + (output_tokens or 0) * price["output_per_mtok"]
        + (cache_read_tokens or 0) * price.get("cache_read_per_mtok", price["input_per_mtok"])
    ) / per_m
    return round(cost, 8)


def weighted_cost(
    input_tokens: Optional[int], output_tokens: Optional[int], cache_read_tokens: Optional[int] = None
) -> float:
    return (
        (input_tokens or 0) * W_INPUT
        + (cache_read_tokens or 0) * W_CACHE_READ
        + (output_tokens or 0) * W_OUTPUT
    )


def resolve_total_tokens(
    tokens_used: Optional[int],
    input_tokens: Optional[int],
    output_tokens: Optional[int],
    cache_read_tokens: Optional[int] = None,
) -> Optional[int]:
    """Keep legacy tokens_used; derive it from the split when only the split is sent."""
    if tokens_used is not None:
        return tokens_used
    if input_tokens is None and output_tokens is None:
        return None
    return (input_tokens or 0) + (output_tokens or 0) + (cache_read_tokens or 0)
