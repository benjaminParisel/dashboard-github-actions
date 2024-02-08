import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GH_TOKEN,
  previews: ["mercy-preview"],
});

export type Workflow = {
  id: number;
  node_id: string;
  name: string;
  path: string;
  state: string;
  created_at: string;
  updated_at: string;
  url: string;
  html_url: string;
  badge_url: string;
  lastRun?: any;
};

export type RepoWithWorkflows = {
  name: string;
  workflows: Workflow[];
};

// List all workflows in a repository
async function listRepoWorkflows(username: string, repoName: string) {
  try {
    const workflows = await octokit.rest.actions.listRepoWorkflows({
      owner: username,
      repo: repoName,
    });
    return workflows.data.total_count != 0
      ? { name: repoName, workflows: workflows.data.workflows }
      : null;
  } catch (error: any) {
    console.error(`Error checking repo ${repoName}: ${error.message}`);
  }
}

async function getLastWorkflowRunState(username: string, repo: any) {
  const runs = await octokit.actions.listWorkflowRunsForRepo({
    owner: username,
    repo: repo,
    per_page: 1,
  });

  if (runs.data.workflow_runs.length > 0) {
    return runs.data.workflow_runs[0].conclusion;
  }

  return null;
}

async function getLastRunWorkflowsState(
  username: string,
  repo: RepoWithWorkflows
) {
  const workflows = await Promise.all(
    repo.workflows.map(async (workflow: any) => {
      // Get latest run for each worfklow
      const runs = await octokit.actions.listWorkflowRuns({
        owner: username,
        repo: repo.name,
        workflow_id: workflow.id,
        exclude_pull_requests: true,
      });
      return { ...workflow, lastRun: runs.data.workflow_runs[0] };
    })
  );
  return workflows;
}

export const getAllWorkflowsForUser = async (username: string) => {
  const repos = await octokit.repos.listForUser({
    username,
    per_page: 100, // Adjust as needed
  });

  const checks = repos.data.map((repo) =>
    listRepoWorkflows(username, repo.name)
  );
  const reposWithWorkflow = (await Promise.all(checks)).filter(Boolean); // Remove null values

  const dashboardData = await Promise.all(
    reposWithWorkflow.map(async (repo) => {
      const lastRunForRepoWorkflows = await getLastRunWorkflowsState(
        username,
        repo as RepoWithWorkflows
      );
      return { name: repo?.name, workflows: lastRunForRepoWorkflows };
    })
  );

  return dashboardData;
};
