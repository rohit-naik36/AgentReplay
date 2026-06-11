import random
from datetime import datetime, timedelta
from app.core.database import SessionLocal
from app.models.run import Run, ToolCall

def seed_db():
    db = SessionLocal()

    # Clean the database so we can rerun this cleanly while iterating on seed data
    db.query(ToolCall).delete()
    db.query(Run).delete()
    db.commit()

    print("Seeding database with complex workflow mock data...")

    # Workflow 1: Shipment Delay Resolution Workflow
    print("Seeding Shipment Delay Workflow...")

    # 1. Initial attempt - Timeout Error
    run1 = Run(
        session_id="wf_shipment_delay_001",
        prompt="Analyze delayed shipment TRK-9921 and recommend resolution. Context: Origin=Shanghai, Dest=LAX, Status=Customs Hold.",
        response=None,
        model="gpt-4-turbo",
        latency_ms=30500,
        tokens_used=120,
        status="failed",
        metadata_json={"workflow_name": "Shipment Delay Resolution", "agent_name": "Logistics Analyst"},
        error_type="TimeoutError",
        error_message="Upstream customs API did not respond within 30s.",
        timeout_reason="Customs API timeout",
        created_at=datetime.now() - timedelta(hours=2)
    )
    db.add(run1)
    db.commit()
    db.refresh(run1)

    db.add(ToolCall(
        run_id=run1.id,
        tool_name="fetch_customs_status",
        input_json={"tracking_number": "TRK-9921"},
        output_json=None,
        status="failed"
    ))
    db.commit()

    # 2. Replay of the timeout run - Success
    run1_replay = Run(
        session_id="wf_shipment_delay_001",
        parent_run_id=run1.id,
        prompt=run1.prompt,
        response='[MOCK REPLAY] Shipment TRK-9921 is held at customs due to missing Form 302. Recommended action: Auto-email logistics coordinator to upload Form 302.',
        model="gpt-4-turbo",
        latency_ms=2100,
        tokens_used=850,
        status="success",
        metadata_json={"workflow_name": "Shipment Delay Resolution", "agent_name": "Logistics Analyst"},
        created_at=datetime.now() - timedelta(hours=1, minutes=55)
    )
    db.add(run1_replay)
    db.commit()
    db.refresh(run1_replay)

    db.add(ToolCall(
        run_id=run1_replay.id,
        tool_name="fetch_customs_status",
        input_json={"tracking_number": "TRK-9921"},
        output_json={"status": "Hold", "reason": "Missing Form 302"},
        status="success"
    ))
    db.commit()

    # Workflow 2: Autonomous Procurement Workflow
    print("Seeding Autonomous Procurement Workflow...")

    # 1. Initial attempt - Malformed JSON
    run2 = Run(
        session_id="wf_procure_884",
        prompt="Generate purchase order payload for 500 units of SKU-XYZ from Vendor A.",
        response="Here is your payload:\n```json\n{ \"sku\": \"SKU-XYZ\", \"qty\": 500, \"vendor\": \"Vendor A\"",
        model="claude-3-opus",
        latency_ms=1800,
        tokens_used=420,
        status="failed",
        metadata_json={"workflow_name": "Autonomous Procurement", "agent_name": "Procurement Bot"},
        error_type="JSONDecodeError",
        error_message="Unterminated string starting at: line 3 column 25 (char 64)",
        malformed_output="True",
        created_at=datetime.now() - timedelta(minutes=45)
    )
    db.add(run2)
    db.commit()
    db.refresh(run2)

    db.add(ToolCall(
        run_id=run2.id,
        tool_name="create_purchase_order",
        input_json={"payload": "{ \"sku\": \"SKU-XYZ\", \"qty\": 500, \"vendor\": \"Vendor A\""},
        output_json=None,
        status="failed"
    ))
    db.commit()

    # 2. Replay of malformed JSON - Success
    run2_replay = Run(
        session_id="wf_procure_884",
        parent_run_id=run2.id,
        prompt=run2.prompt,
        response='[MOCK REPLAY] ```json\n{\n  "sku": "SKU-XYZ",\n  "qty": 500,\n  "vendor": "Vendor A"\n}\n```',
        model="claude-3-opus",
        latency_ms=1950,
        tokens_used=435,
        status="success",
        metadata_json={"workflow_name": "Autonomous Procurement", "agent_name": "Procurement Bot"},
        created_at=datetime.now() - timedelta(minutes=42)
    )
    db.add(run2_replay)
    db.commit()
    db.refresh(run2_replay)

    db.add(ToolCall(
        run_id=run2_replay.id,
        tool_name="create_purchase_order",
        input_json={"payload": "{\"sku\": \"SKU-XYZ\", \"qty\": 500, \"vendor\": \"Vendor A\"}"},
        output_json={"po_number": "PO-99120", "status": "Created"},
        status="success"
    ))
    db.commit()


    # Workflow 3: Multi-Agent Escalation Workflow
    print("Seeding Multi-Agent Escalation Workflow...")

    # 1. Initial attempt - Token Limit Hit
    context_str = "Customer History: " + ("Return requested. " * 500)
    run3 = Run(
        session_id="wf_escalate_501",
        prompt=f"Review customer history and escalate if high risk. {context_str}",
        response=None,
        model="gemini-1.5-pro",
        latency_ms=8500,
        tokens_used=8192,
        status="failed",
        metadata_json={"workflow_name": "Customer Support Escalation", "agent_name": "Triage Agent"},
        error_type="ContextLengthExceeded",
        error_message="The model's maximum context length is 8192 tokens. However, your messages resulted in 8250 tokens.",
        token_limit_hit="True",
        created_at=datetime.now() - timedelta(minutes=10)
    )
    db.add(run3)
    db.commit()
    db.refresh(run3)

    # 2. Replay - Truncated Context Success
    run3_replay = Run(
        session_id="wf_escalate_501",
        parent_run_id=run3.id,
        prompt=f"Review customer history and escalate if high risk. [TRUNCATED] Customer History: ... Return requested.",
        response="[MOCK REPLAY] Customer has excessive return history. Escalating to human agent.",
        model="gemini-1.5-pro",
        latency_ms=2500,
        tokens_used=150,
        status="success",
        metadata_json={"workflow_name": "Customer Support Escalation", "agent_name": "Triage Agent"},
        created_at=datetime.now() - timedelta(minutes=8)
    )
    db.add(run3_replay)
    db.commit()
    db.refresh(run3_replay)

    db.add(ToolCall(
        run_id=run3_replay.id,
        tool_name="escalate_ticket",
        input_json={"ticket_id": "TCK-551", "reason": "Excessive returns"},
        output_json={"status": "Escalated to Tier 2"},
        status="success"
    ))
    db.commit()

    db.close()
    print("Database seeding complete.")

if __name__ == "__main__":
    seed_db()
