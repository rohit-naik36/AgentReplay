# SDK Integration Requirements

The following requirements must be enforced by any external SDKs (such as the Python SDK or future Node.js variants) publishing to the `POST /api/runs` ingestion route to ensure data integrity and pass strict Pydantic validation rules.

## 1. Allowed Status Values
The API explicitly rejects unknown status states. All run entries (and intermediate `tool_calls`) must use one of the following exact string literals:
* `"success"`
* `"failed"`
* `"running"`
* `"replayed"`

If an external tool fails, the SDK must explicitly map that state to `"failed"` rather than passing down a custom error state name.

## 2. Numeric Boundaries
The schema strictly enforces non-negative constraints for usage telemetry:
* `latency_ms` must be `ge=0`. If telemetry fails to calculate time correctly resulting in a negative delta, the SDK should either drop the payload parameter or submit `0`.
* `tokens_used` must be `ge=0`.

## 3. String Limits
String bounds are restricted natively to prevent memory overflow in Postgres:
* `session_id`: Max 255 characters.
* `model`: Max 255 characters.
* `tool_name`: Max 255 characters.
* `error_type`: Max 255 characters.
* `malformed_output`: Max 255 characters.
* `token_limit_hit`: Max 255 characters.

*Note: The `prompt` and `response` fields are unbounded standard strings.*
