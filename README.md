# Electron Terminal Application

这是一个基于 Electron 的终端应用程序，该应用程序允许用户在桌面环境中执行命令并查看输出。

## 目录

- [功能](#功能)
- [安装](#安装)
- [使用方法](#使用方法)
- [命令](#命令)
- [贡献](#贡献)
- [许可证](#许可证)

## 功能

- 支持执行系统命令
- 实时显示命令输出
- 支持多行输出
- 简单易用的用户界面

## 安装

1. 确保您已安装 [Node.js](https://nodejs.org/)（建议使用 LTS 版本）。
2. 克隆此仓库：

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

3. 安装依赖：

   ```bash
   npm install
   ```

4. 启动应用程序：

   ```bash
   npx electron .
   ```
5. 构建应用程序：

   ```bash
   npm run build
   ```
## 使用方法

1. 启动应用程序后，您将看到一个终端界面。
2. 在终端中输入您想要执行的命令，然后按 `Enter` 键。
3. 输出将实时显示在终端中。

## 命令

您可以在终端中执行任何有效的系统命令，例如：

- `dir`（Windows）或 `ls`（Linux/Mac）: 列出当前目录中的文件和文件夹。
- `echo Hello, World!`: 输出 "Hello, World!"。
- `ping google.com`: 测试与 Google 的连接。

## 贡献

欢迎任何形式的贡献！请遵循以下步骤：

1. Fork 此仓库。
2. 创建您的特性分支 (`git checkout -b feature/YourFeature`)。
3. 提交您的更改 (`git commit -m 'Add some feature'`)。
4. 推送到分支 (`git push origin feature/YourFeature`)。
5. 创建一个新的 Pull Request。

## 许可证

此项目使用 [MIT 许可证](LICENSE)。