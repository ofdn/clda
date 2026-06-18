const { Octokit } = require("@octokit/rest");

const octokit  = new Octokit({ auth: process.env.GITHUB_TOKEN });
const OWNER    = "ofdn";
const REPO     = "clda";
const BASE     = "main";

const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type":                 "application/json",
};

exports.handler = async function (event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS, body: "" };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  let name, email, module, description, suggestion;
  try {
    ({ name, email, module, description, suggestion } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  if (!name || !email || !module || !description) {
    return {
      statusCode: 400,
      headers: CORS,
      body: JSON.stringify({ error: "name, email, module and description are required" }),
    };
  }

  try {
    const branch   = `suggest/${Date.now()}`;
    const slug     = branch.replace("suggest/", "");
    const filepath = `submissions/${slug}.md`;

    // Format using TOML front matter to match the rest of this project
    const fileContent = [
      "+++",
      `title = "Suggestion: ${description.replace(/"/g, '\\"')}"`,
      `date = ""`,
      "+++",
      "",
      `**Submitted by:** ${name} (${email})`,
      `**Module:** ${module}`,
      "",
      "## Description",
      "",
      description,
      "",
      suggestion ? `## Suggested content\n\n${suggestion}` : "",
    ].join("\n");

    // 1. Get latest SHA from main
    const { data: refData } = await octokit.git.getRef({
      owner: OWNER, repo: REPO, ref: `heads/${BASE}`,
    });
    const baseSha = refData.object.sha;

    // 2. Create a new branch
    await octokit.git.createRef({
      owner: OWNER, repo: REPO,
      ref: `refs/heads/${branch}`,
      sha: baseSha,
    });

    // 3. Commit the suggestion file to the new branch
    await octokit.repos.createOrUpdateFileContents({
      owner:   OWNER,
      repo:    REPO,
      path:    filepath,
      message: `suggest: ${description}`,
      content: Buffer.from(fileContent).toString("base64"),
      branch,
      committer: { name, email },
    });

    // 4. Open a pull request
    const { data: pr } = await octokit.pulls.create({
      owner: OWNER,
      repo:  REPO,
      title: `Suggestion: ${description}`,
      head:  branch,
      base:  BASE,
      body: [
        `**From:** ${name} (${email})`,
        `**Module:** ${module}`,
        "",
        `**Description:** ${description}`,
        suggestion ? `\n**Suggested content:**\n\`\`\`\n${suggestion}\n\`\`\`` : "",
      ].join("\n"),
    });

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({ prUrl: pr.html_url }),
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
