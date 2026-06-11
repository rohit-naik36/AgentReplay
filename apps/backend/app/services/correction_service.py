from typing import Dict, Any, Tuple

class CorrectionService:
    @staticmethod
    def suggest(payload: Dict[str, Any], failure_reason: str) -> Tuple[Dict[str, Any], str]:
        correction = {}
        reason = ""

        if failure_reason == "Inventory unavailable":
            correction = payload.copy()
            correction["quantity"] = 15
            reason = "Requested quantity exceeds stock"
        elif failure_reason == "Missing destination":
            correction = payload.copy()
            correction["destination"] = "India"
            reason = "A destination is required to route the shipment"
        elif failure_reason == "Missing customer ID":
            correction = payload.copy()
            correction["customer_id"] = "CUST-1001"
            reason = "A valid customer identifier is required for escalation"

        return correction, reason
