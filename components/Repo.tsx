import { RepoWithWorkflows } from "@/lib/github";
import { WorkflowSummary } from "./WorkflowSummary";

export type RepoProps = {
  repo: RepoWithWorkflows;
};

export const Repo = (props: RepoProps) => {
  return (
    <div className="flex flex-col border-2">
      <div className="text-xl">{props.repo.name}</div>
      {props.repo.workflows.map((action: any, index) => (
        <WorkflowSummary key={index} workflow={action} />
      ))}
    </div>
  );
};
