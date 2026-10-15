from app.services.pricing import compute_cost_usd, resolve_total_tokens, weighted_cost

P = {"m": {"input_per_mtok": 1.0, "output_per_mtok": 5.0, "cache_read_per_mtok": 0.1}}


def test_cost_uses_split_prices():
    assert compute_cost_usd("m", 1_000_000, 1_000_000, 1_000_000, prices=P) == 6.1


def test_unknown_model_has_no_cost():
    assert compute_cost_usd("other", 10, 10, prices=P) is None


def test_no_tokens_no_cost():
    assert compute_cost_usd("m", None, None, prices=P) is None


def test_total_tokens_legacy_wins_else_derived():
    assert resolve_total_tokens(99, 1, 2) == 99
    assert resolve_total_tokens(None, 10, 5, 3) == 18
    assert resolve_total_tokens(None, None, None) is None


def test_weighted_cost_matches_benchmark_weights():
    assert weighted_cost(100, 10, 50) == 100 + 5 + 40
