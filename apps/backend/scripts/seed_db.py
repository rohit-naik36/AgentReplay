import random
from datetime import datetime, timedelta
from app.core.database import SessionLocal
from app.models.run import Run, ToolCall

def seed_db():
    db = SessionLocal()

    # Check if we already have data
    if db.query(Run).count() > 0:
        print("Database already seeded. Skipping.")
        db.close()
        return

    print("Seeding database with mock data...")

    models = ["gpt-4-turbo", "gpt-3.5-turbo", "claude-3-opus", "gemini-1.5-pro"]
    statuses = ["success", "success", "success", "failed"]

    # Generate some realistic looking runs
    for i in range(25):
        status = random.choice(statuses)
        prompt = f"Analyze this user request and extract key entities: Request #{i+1000}"

        response = None
        if status == "success":
            response = f"Found entities: User, Location, Action for Request #{i+1000}"
        elif random.random() > 0.5:
            response = "Error: Context length exceeded."

        run = Run(
            session_id=f"session_{random.randint(100, 999)}",
            prompt=prompt,
            response=response,
            model=random.choice(models),
            latency_ms=random.randint(500, 5000),
            tokens_used=random.randint(100, 2000),
            status=status,
            metadata_json={"environment": "production", "client_version": "1.2.0"},
            created_at=datetime.utcnow() - timedelta(minutes=random.randint(1, 1000))
        )
        db.add(run)
        db.commit()
        db.refresh(run)

        # Add tool calls for some runs
        if random.random() > 0.5:
            tc = ToolCall(
                run_id=run.id,
                tool_name="extract_entities",
                input_json={"text": prompt},
                output_json={"entities": ["User", "Location", "Action"]} if status == "success" else None,
                status=status
            )
            db.add(tc)

        # Add a mock replay for a few runs to show lineage
        if i % 5 == 0 and status == "success":
            replayed_run = Run(
                session_id=run.session_id,
                parent_run_id=run.id,
                prompt=run.prompt,
                response=f"[MOCK REPLAY] {run.response}",
                model=run.model,
                latency_ms=run.latency_ms + random.randint(-100, 100),
                tokens_used=run.tokens_used,
                status="replayed",
                metadata_json=run.metadata_json,
                created_at=datetime.now()
            )
            db.add(replayed_run)
            db.commit()
            db.refresh(replayed_run)

            # Replayed tool call
            replayed_tc = ToolCall(
                run_id=replayed_run.id,
                tool_name="extract_entities",
                input_json={"text": prompt},
                output_json={"entities": ["User", "Location", "Action"], "_replay_note": "This is a mock replay"},
                status=status
            )
            db.add(replayed_tc)


    db.commit()
    db.close()
    print("Database seeding complete.")

if __name__ == "__main__":
    seed_db()
