import {
  warning,
  startGroup,
  setSecret,
  setOutput,
  endGroup,
  info,
  setFailed,
} from "@actions/core";
import { getExecOutput } from "@actions/exec";

import { login } from "./auth";
import { install } from "./installer";
import { setupProject } from "./project";

export const run = async () => {
  setSecret("gcp_sa_key");
  setSecret("firebase_token");

  try {

    try {
      await install();
    } catch (ex) {
      console.error(`Error installing firebase-tools`, ex)
      throw ex
    }
    try {
      await login();
    }
    catch (ex) {
      console.error(`Error logging in to firebase`, ex)
      throw ex
    }
    try {
      await setupProject();
    } catch (ex) {
      console.error(`Error setting up project`, ex)
      throw ex
    }
  } catch (ex) {
    setFailed(JSON.stringify(ex));
  }
};

export const printEnvDetailsAndSetOutput = async () => {
  startGroup("Environment details");
  const promises = ["node", "java", "firebase"].map(async (tool) => {
    const output = await getToolVersion(tool, ["--version"]);

    if (tool === "node") {
      setOutput(`${tool}-version`, output);
    }

    info(`${tool}: ${output}`);
  });

  await Promise.all(promises);
  endGroup();
};

const getToolVersion = async (tool: string, options: string[]) => {
  try {
    const { stdout, stderr, exitCode } = await getExecOutput(tool, options, {
      ignoreReturnCode: true,
      silent: true,
    });

    if (exitCode > 0) {
      warning(`[warning]${stderr}`);
      return "";
    }

    return stdout;
  } catch (err) {
    return "";
  }
};
