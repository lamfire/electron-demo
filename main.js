const {app, screen, shell, BrowserWindow, BrowserView, ipcMain, dialog, clipboard, session } = require('electron')
const { exec, spawn } = require('child_process');
const path = require('path');
const os = require('os');
//const iconv = require('iconv-lite'); // 导入 iconv 模块

let mainWindow;
let platform = os.platform(); // 获取操作系统平台

function runCommand(command) {
    if (platform === 'win32') {
    const child = spawn(`chcp 65001 && ${command}`, { shell: true});
        return child;
    } else {
        const child = spawn(command, { shell: true});
        return child;
    }
}

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // 引用 preload 脚本
            contextIsolation: true, // 启用上下文隔
            nodeIntegration: false, // 禁用 Node.js 集成
            encoding: 'utf-8', 
        }
    });

    mainWindow.loadFile('index.html');
});




// 监听命令
ipcMain.on('run-command', (event, command) => {
    // 使用 spawn 运行命令
    const child = runCommand(command);

    // 逐行读取 stdout
    child.stdout.on('data', (data) => {
        // 将输出转换为字符串并逐行发
        //console.log(data);
        //const output = iconv.decode(data, 'cp936').toString('utf-8');
        const output = data.toString();
        output.split('\n').forEach(line => {
            if (line) { // 只发送非空行
                event.reply('command-output', line);
            }
        });
    });

    // 处理错误输出
    child.stderr.on('data', (data) => {
        const errorOutput = data.toString();
        errorOutput.split('\n').forEach(line => {
            if (line) { // 只发送非空行
                event.reply('command-output', `Error: ${line}`);
            }
        });
    });

    // 处理子进程结束
    child.on('close', (code) => {
        console.log(`Child process exited with code ${code}`);
        event.reply('command-output', `Process exited with code ${code}`);
    });
});
