const {app, screen, shell, BrowserWindow, BrowserView, ipcMain, dialog, clipboard, session } = require('electron')
const { exec, spawn } = require('child_process');
const path = require('path');
const os = require('os');
//const iconv = require('iconv-lite'); // 导入 iconv 模块

let mainWindow;
let platform = os.platform(); // 获取操作系统平台
let currentCodePage; // 存储当前代码页的变量

// 获取当前代码页
function getCurrentCodePage(callback) {
    if(platform != 'win32') return;
    exec('chcp', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing chcp: ${error.message}`);
            return;
        }
        //console.log(stdout);
        // 解析输出，提取代码页
        const codePageMatch = stdout.match(/:\s*(\d+)/); // 修改正则表达式
        if (codePageMatch) {
            currentCodePage = codePageMatch[1]; // 存储代码页
            console.log(`Current code page: ${currentCodePage}`);
            if (callback) callback(currentCodePage);
        } else {
            console.log('Could not determine the current code page.');
        }
    });
}

function decodeWithMultipleEncodings(data) {
    const encodings = [currentCodePage,'utf8', 'gbk', 'gb2312', 'shift_jis', 'euc-kr'];
    for (let encoding of encodings) {
        try {
            return iconv.decode(data, encoding);
        } catch (error) {
            console.warn(`Failed to decode with ${encoding}`);
        }
    }
    return data.toString(); // 如果所有尝试都失败，返回原始字符串
}

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
    getCurrentCodePage();
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
        const output = decodeWithMultipleEncodings(data);
        output.split('\n').forEach(line => {
            if (line) { // 只发送非空行
                event.reply('command-output', line);
            }
        });
    });

    // 处理错误输出
    child.stderr.on('data', (data) => {
        const errorOutput = decodeWithMultipleEncodings(data);
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
