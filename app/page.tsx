import { Repo } from "@/components/Repo";
import { getAllWorkflowsForUser } from "@/lib/github";

export default async function Home() {
  const repos = await getAllWorkflowsForUser("benjaminParisel");

  const reposWithLastRunWorkflows = repos.map((repo) => ({
    ...repo,
    workflows: repo.workflows.filter(
      (workflow) => workflow.lastRun !== undefined
    ),
  }));

  const worklowsOnError = repos
    .map((repo) => ({
      ...repo,
      workflows: repo.workflows.filter(
        (workflow) =>
          workflow.lastRun !== undefined &&
          workflow.lastRun.conclusion !== "success"
      ),
    }))
    .filter((repo) => repo.workflows.length > 0);

  return (
    <main className="flex flex-col items-center justify-between p-12">
      <h1>Github Dashboard</h1>
      {/* <pre className="flex">{JSON.stringify(repos, undefined, 2)}</pre> */}
      <div className="flex flex-col gap-5">
        {worklowsOnError.map((repo: any) => (
          <Repo key={repo.name} repo={repo}></Repo>
        ))}
      </div>
    </main>
  );
}
