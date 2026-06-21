import express from 'express';
import morgan from 'morgan';
import {createPod} from './kubernetes/pod.js';
import {createService} from './kubernetes/service.js';
import {v7 as uuid} from 'uuid';

const app = express();
const projects = new Map();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/sandbox/health', (req, res) => {
    res.status(200).json({
        message: 'Sandbox API is healthy',
        status: 'ok'
    });
});

app.get('/api/sandbox/project', (req, res) => {
    res.status(200).json({
        projects: Array.from(projects.values())
    });
});

app.post('/api/sandbox/project', (req, res) => {
    const title = req.body.title?.trim();

    if (!title) {
        return res.status(400).json({
            message: 'Project title is required',
            status: 'error'
        });
    }

    const project = {
        _id: uuid(),
        title,
        createdAt: new Date().toISOString()
    };

    projects.set(project._id, project);

    res.status(201).json({
        message: 'Project created successfully',
        project
    });
});

app.post('/api/sandbox/start', async (req, res) => {
    const sandboxId = req.body.projectId || uuid();

    try {
        await Promise.all([
            createPod(sandboxId),
            createService(sandboxId)
        ]);

        return res.status(200).json({
            message: 'Sandbox started successfully',
            sandboxId,
            previewUrl:`http://${sandboxId}.preview.localhost`,
            agentUrl:`http://${sandboxId}.agent.localhost`
        });
    } catch (error) {
        if (error.response?.statusCode === 409 || error.statusCode === 409) {
            return res.status(200).json({
                message: 'Sandbox already exists',
                sandboxId,
                previewUrl:`http://${sandboxId}.preview.localhost`,
                agentUrl:`http://${sandboxId}.agent.localhost`
            });
        }

        console.error('Failed to start sandbox:', error);
        return res.status(500).json({
            message: 'Failed to start sandbox',
            status: 'error',
            error: error.message
        });
    }
});

app.use('/api/sandbox', (req, res) => {
    res.status(404).json({
        message: 'Sandbox API route not found',
        method: req.method,
        path: req.originalUrl,
        availableRoutes: [
            'GET /api/sandbox/health',
            'GET /api/sandbox/project',
            'POST /api/sandbox/project',
            'POST /api/sandbox/start'
        ]
    });
});

export default app;
