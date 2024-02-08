import github from "@/lib/github";

const octokit = github();

const listReposInOrg = octokit.rest.teams.listReposInOrg({
  org: "Bonitasoft",
  team_slug: "admin",
});
