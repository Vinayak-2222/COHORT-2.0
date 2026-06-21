import express from 'express';
import morgan from 'morgan';
import {createProxyMiddleware} from 'http-proxy-middleware';
import {createProxyServer} from 'httpxy';
import http from 'node:http';

const app = express();
const wsProxy = createProxyServer();
app.use(morgan('combined'));

wsProxy.on('error', (error, req, socket) => {
    console.error(`WebSocket proxy error for ${req?.headers?.host ?? 'unknown host'}:`, error.message);
    socket?.destroy();
});

app.get('/api/status/healthz', (req, res) => {
    res.status(200).json({status: 'ok'});
});
app.get('/api/status/readyz', (req, res) => {
    res.status(200).json({status: 'ready'});
});

const proxies = {};
const agentProxies = {};
function getProxy(sandboxId) {
    const target = `http://sandbox-service-${sandboxId}`;
    if (!proxies[sandboxId]) {
        proxies[sandboxId] = createProxyMiddleware({
            target,
            changeOrigin: true,
        })
    }
    return proxies[sandboxId];
}
function getAgentProxy(sandboxId) {
    const target = `http://sandbox-service-${sandboxId}:3000`;
    if (!agentProxies[sandboxId]) {
        agentProxies[sandboxId] = createProxyMiddleware({
            target,
            changeOrigin: true,
        })
    }
    return agentProxies[sandboxId];
}

app.use((req, res, next) => {
    const host=req.headers.host;
    const sandboxId = host.split('.')[0];
    /**
     * pod1.preview.localhost
     * podl.agent.localhost
     */
    if(host.split('.')[1] === 'agent') {
        return getAgentProxy(sandboxId)(req, res, next);
    }
    else if(host.split('.')[1] === 'preview') {
        return getProxy(sandboxId)(req, res, next);
    }
    
});


// Create the HTTP server explicitly
const server = http.createServer(app);

server.on('upgrade', (req, socket, head) => {
    const host = req.headers.host;
    if (!host) { socket.destroy(); return; }

    // Prevent EPIPE and connection-reset errors from crashing the process
    // during an active proxied WebSocket session.
    socket.on('error', () => socket.destroy());

    const [sandboxId, type] = host.split(':')[0].split('.');

    console.log(`WS upgrade request: ${host}, sandboxId: ${sandboxId}, type: ${type}`);

    let target;
    if (type === 'agent') {
        target = `http://sandbox-service-${sandboxId}:3000`;
    } else if (type === 'preview') {
        target = `http://sandbox-service-${sandboxId}`;
    } else {
        socket.destroy();
        return;
    }

    wsProxy.ws(req, socket, {target, changeOrigin: true}, head)
        .catch((error) => {
            console.error(`WebSocket upgrade failed for ${host}:`, error.message);
            socket.destroy();
        });
});
export default server;
