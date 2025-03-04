const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({ auth: process.env.GH_ACCESS_TOKEN });

async function updateFile() {
  const owner = 'Re123SW';
  const repo = 'xf';
  const path = 'README.md';
  const branch = 'main';

  // Получение текущего содержимого файла
  const { data: { content, sha } } = await octokit.repos.getContent({
    owner,
    repo,
    path,
    ref: branch,
  });

  // Обновление содержимого файла (преобразование из base64)
  const updatedContent = Buffer.from(content, 'base64').toString('utf8') + '\n# Updated by GitHub Copilot';

  // Сохранение обновленного файла
  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message: 'Update README.md',
    content: Buffer.from(updatedContent).toString('base64'),
    sha,
    branch,
  });

  console.log('File updated successfully');
}

updateFile().catch(error => console.error(error));