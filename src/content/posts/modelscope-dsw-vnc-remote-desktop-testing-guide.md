---
title: 【云端实测】魔搭平台（ModelScope）DSW 配置 VNC 远程桌面与 WebSocket 连通性测试指南
published: 2026-10-16
description: 基于 ModelScope 魔搭平台 DSW 实例，从 HTTP 端口透传、WebSocket 连通性验证到 XFCE4 桌面与 noVNC 服务的完整配置流程，包含 15 张实操步骤截图与避坑实测。
image: /assets/images/modelscope-vnc/step_15.png
tags: [ModelScope, 远程开发, 工程实践]
category: 技术架构
draft: false
---

## 📌 背景介绍

在阿里云 **ModelScope（魔搭平台）** 的 DSW（Data Science Workshop）容器环境中，平台默认主要提供基于 Web 的 JupyterLab 和纯命令行终端。

但在实际进行模型调试、GUI 工具操作、自动化测试以及具身智能可视化时，我们常常需要一个真正的 **Linux 图形桌面界面**。本文基于魔搭实例环境，完整记录从**底层端口转发与 WebSocket 连通性测试**，到**搭建 XFCE4 桌面并利用 noVNC 实现免客户端网页直连**的全流程实操记录。

---

## 🛠️ 第一步：启动实例并进入终端

首先在魔搭控制台中打开实例（以 CPU 或 GPU 环境下的 Notebook 为例）：

![打开魔搭环境下的Notebook](/assets/images/modelscope-vnc/step_01.png)

等待实例状态变为运行中，点击进入 DSW 工作空间：

![启动DSW开发实例](/assets/images/modelscope-vnc/step_02.png)

进入熟悉的 JupyterLab 交互界面：

![进入Notebook环境](/assets/images/modelscope-vnc/step_03.png)

在工作区点击菜单 `File` ➔ `New` ➔ `Terminal`，新建一个黑色终端窗口：

![在JupyterLab新建终端](/assets/images/modelscope-vnc/step_04.png)

---

## 🌐 第二步：测试实例 HTTP 端口反向代理转发

在配置复杂的 VNC 服务之前，首先要验证魔搭平台的网关是否支持向外暴露自定义端口。

在终端中输入以下命令，启动一个临时的 Python HTTP 测试服务（监听 8765 端口）：

```bash
mkdir -p /tmp/port-test
echo "DSW PORT TEST OK" > /tmp/port-test/index.html
cd /tmp/port-test
python -m http.server 8765 --bind 0.0.0.0
```

![启动8765端口测试服务](/assets/images/modelscope-vnc/step_05.png)

接下来查找当前实例的专属名称（在当前浏览器的 URL 地址栏中即可找到）：

![查找与提取实例名称](/assets/images/modelscope-vnc/step_06.png)

> **实例 URL 规律**：  
> 例如当前实例地址为：`https://dsw-gateway-cn-hangzhou.data.aliyun.com/dsw-2261799/proxy/8765/`  
> 其中 `dsw-2261799` 即为**实例名称**。

大家在测试端口转发时，修改链接并填入自己的实例名称：  
`https://dsw-gateway-cn-hangzhou.data.aliyun.com/{你的实例名称}/proxy/8765/`

保持终端服务运行，在浏览器中打开该测试链接，出现如下字样即说明魔搭平台的端口转发机制完全正常：

![端口测试返回成功](/assets/images/modelscope-vnc/step_07.png)

---

## 🔌 第三步：测试 WebSocket 协议连通性

由于 noVNC 必须依赖 **WebSocket 协议**与后端的 websockify 进行双向实时数据交互，因此必须进一步测试魔搭反向代理网关是否会拦截 WebSocket。

在 JupyterLab 中打开第二个新终端，安装 aiohttp 并运行轻量 WebSocket 测试脚本：

```bash
python -m pip install -q aiohttp

cat > /tmp/test_ws.py <<'PY'
from aiohttp import web

async def home(request):
    return web.Response(text="""
    <h2>DSW WebSocket Test</h2>
    <pre id="result">Connecting...</pre>
    <script>
      const url = new URL('ws', location.href);
      url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
      const ws = new WebSocket(url);
      ws.onmessage = e =>
        document.getElementById('result').textContent = e.data;
      ws.onerror = () =>
        document.getElementById('result').textContent = 'WebSocket ERROR';
    </script>
    """, content_type="text/html")

async def websocket(request):
    ws = web.WebSocketResponse()
    await ws.prepare(request)
    await ws.send_str("WEBSOCKET OK")
    async for message in ws:
        pass
    return ws

app = web.Application()
app.router.add_get("/", home)
app.router.add_get("/ws", websocket)
web.run_app(app, host="0.0.0.0", port=8766)
PY

python /tmp/test_ws.py
```

![启动WebSocket测试服务](/assets/images/modelscope-vnc/step_08.png)

同样，在浏览器中打开对应 8766 端口的测试链接：  
`https://dsw-gateway-cn-hangzhou.data.aliyun.com/{你的实例名称}/proxy/8766/`

页面回显如下图所示的 `WEBSOCKET OK`，说明平台的 WebSocket 通道畅通无阻，可以放心部署 noVNC：

![WebSocket连通性验证成功](/assets/images/modelscope-vnc/step_09.png)

---

## 💻 第四步：安装 noVNC 与 XFCE4 桌面组件

确定网络通道完全支持后，我们在终端中正式安装图形桌面与远程控制协议栈。

### 1. 安装桌面核心依赖包

```bash
apt-get update
DEBIAN_FRONTEND=noninteractive apt-get install -y \
  --no-install-recommends \
  xfce4 xfce4-terminal \
  xvfb x11vnc novnc websockify \
  dbus-x11 xfonts-base
```

![安装桌面组件依赖](/assets/images/modelscope-vnc/step_10.png)

安装涉及较多字体和图形渲染库，下载与解压安装通常需要数分钟：

![桌面组件安装完成](/assets/images/modelscope-vnc/step_11.png)

出现上述终端提示即表示基础组件安装完成。

### 2. 设置 VNC 访问密码

为了安全起见，配置 VNC 服务的连接密码：

```bash
mkdir -p ~/.vnc
x11vnc -storepasswd ~/.vnc/passwd
chmod 600 ~/.vnc/passwd
```

在终端交互提示下连续输入两次你自己设定的密码（注意终端中输入密码时不回显），并选择 `y` 保存密码文件：

![设置VNC访问密码](/assets/images/modelscope-vnc/step_12.png)

---

## 🚀 第五步：启动服务与桌面会话

依次在终端中执行以下命令拉起各个服务守护进程：

### 1. 启动虚拟显示器与 XFCE 会话
```bash
# 启动 1280x800 分辨率、24位真彩色的虚拟屏幕 :99
Xvfb :99 -screen 0 1280x800x24 -nolisten tcp > /tmp/xvfb.log 2>&1 &

sleep 2

# 在 :99 屏幕下拉起 XFCE4 桌面
DISPLAY=:99 dbus-launch --exit-with-session xfce4-session > /tmp/xfce.log 2>&1 &
```

### 2. 启动 x11vnc 服务
```bash
DISPLAY=:99 x11vnc \
  -display :99 \
  -rfbport 5900 \
  -localhost \
  -forever \
  -shared \
  -rfbauth ~/.vnc/passwd \
  > /tmp/x11vnc.log 2>&1 &
```

### 3. 启动 noVNC 网关
```bash
websockify --web=/usr/share/novnc 0.0.0.0:6080 127.0.0.1:5900
```

> **注意**：请保持运行 `websockify` 的终端窗口不关闭。

---

## 🖥️ 第六步：浏览器连线访问

noVNC 使用 WebSocket 转发 VNC 画面数据。在浏览器中打开专用连接链接（**注意替换为你自己的实例名称**）：

```text
https://dsw-gateway-cn-hangzhou.data.aliyun.com/{你的实例名称}/proxy/6080/vnc.html?path={你的实例名称}%2Fproxy%2F6080%2Fwebsockify
```

页面将展示出标准的 noVNC 网页客户端连接界面：

![打开noVNC网页端登录页面](/assets/images/modelscope-vnc/step_13.png)

点击左侧的 **「Connect」** 按钮，在弹出的窗口中输入刚刚设置的 VNC 密码：

![输入VNC密码连接](/assets/images/modelscope-vnc/step_14.png)

敲击回车确认，熟悉的 **XFCE4 Linux 图形桌面** 瞬间呈现在网页之中！

![成功进入云端XFCE4桌面环境](/assets/images/modelscope-vnc/step_15.png)

至此，魔搭云端环境下的远程桌面测试与部署大功告成！你可以在网页中自由使用终端、文件管理器或运行任何带 GUI 交互的开发程序。
