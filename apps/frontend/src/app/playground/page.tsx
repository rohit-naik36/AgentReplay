import { PlaygroundContainer } from "./playground-container";

export default function PlaygroundPage() {
    return (
        <div className="flex flex-col gap-6 w-full pb-20">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold tracking-tight">Execution Playground</h1>
            </div>
            <p className="text-muted-foreground text-sm max-w-2xl">
                Simulate AI agent workflows with deterministic failures. See diagnostics in real-time, apply corrections, and replay workflows to observe how AgentReplay handles errors.
            </p>
            <PlaygroundContainer />
        </div>
    )
}
