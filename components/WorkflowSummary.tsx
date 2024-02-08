import { workflowRun } from "@/lib/Github";
import Link from "next/link";
import { Button } from "./ui/button";

export type WorkflowSummaryProps = { workflow: any };

export const WorkflowSummary = (props: WorkflowSummaryProps) => {
  const lastRun = props.workflow.lastRun as workflowRun;

  function hasLastRun(workflow: any) {
    return workflow.lastRun !== undefined;
  }

  function getLatestStatus(run: workflowRun) {
    if (!run) return <div>⚪</div>;

    if (run.conclusion === "success") {
      return <div>🟢</div>;
    } else if (run.conclusion === "failure") {
      return <div>🔴</div>;
    }
    return <div>{run.conclusion}</div>;
  }
  return (
    <div className="flex justify-between items-center px-3">
      {!lastRun && <div>{props.workflow?.name}</div>}
      {lastRun && (
        <>
          <Button variant="link" className="text-2md">
            <Link href={lastRun.html_url}>{props.workflow?.name}</Link>
          </Button>
          <p>{lastRun.head_branch}</p>
          <p>{lastRun.run_started_at}</p>
          <Link href={lastRun.html_url}>{getLatestStatus(lastRun)}</Link>
        </>
      )}
    </div>
  );
};
