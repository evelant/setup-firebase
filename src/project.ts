import { getInput, endGroup, startGroup } from "@actions/core";
import { exec } from "@actions/exec";

export const setupProject = async () => {
  startGroup("Setup Project");
  const projectId = getInput("project_id");
  const path = getInput("project_path");
  const opts = path ? { cwd: path } : undefined;

  if (projectId) {
    await exec(`firebase`, ["use", `--add`, projectId], opts);
  }
  endGroup();
};
