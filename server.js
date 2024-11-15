const express = require('express');
const os = require('os');
const si = require('systeminformation');
const useragent = require('express-useragent');

const app = express();
const port = process.env.PORT || 8080;

// Use useragent middleware
app.use(useragent.express());

app.get('/', async (req, res) => {
    try {
        // Basic system info using os module
        const cpu = os.cpus()[0].model;
        const cores = os.cpus().length;
        const totalMem = (os.totalmem() / 1024 ** 3).toFixed(2) + ' GB';
        const freeMem = (os.freemem() / 1024 ** 3).toFixed(2) + ' GB';
        const osType = os.type();
        const osRelease = os.release();
        const hostname = os.hostname();

        // Advanced system info using systeminformation module
        const gpuInfo = await si.graphics();
        const ramInfo = await si.mem();

        // GPU details
        const gpuDetails = gpuInfo.controllers
            .map(gpu => `${gpu.model} (${gpu.vram} MB VRAM)`)
            .join(', ');

        // Browser details using useragent middleware
        const browserInfo = req.useragent;

        // Building the HTML response
        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Device and Browser Information</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    h1 { color: #333; }
                    table { border-collapse: collapse; width: 100%; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f4f4f4; }
                </style>
            </head>
            <body>
                <h1>Device and Browser Information</h1>
                <table>
                    <tr><th>Property</th><th>Value</th></tr>
                    <tr><td>CPU</td><td>${cpu}</td></tr>
                    <tr><td>CPU Cores</td><td>${cores}</td></tr>
                    <tr><td>Total Memory</td><td>${totalMem}</td></tr>
                    <tr><td>Free Memory</td><td>${freeMem}</td></tr>
                    <tr><td>OS Type</td><td>${osType}</td></tr>
                    <tr><td>OS Release</td><td>${osRelease}</td></tr>
                    <tr><td>Hostname</td><td>${hostname}</td></tr>
                    <tr><td>GPU</td><td>${gpuDetails || 'No GPU Detected'}</td></tr>
                    <tr><td>Total RAM</td><td>${(ramInfo.total / 1024 ** 3).toFixed(2)} GB</td></tr>
                    <tr><td>Browser</td><td>${browserInfo.browser}</td></tr>
                    <tr><td>Browser Version</td><td>${browserInfo.version}</td></tr>
                    <tr><td>Operating System</td><td>${browserInfo.os}</td></tr>
                    <tr><td>Platform</td><td>${browserInfo.platform}</td></tr>
                    <tr><td>Device</td><td>${browserInfo.isMobile ? 'Mobile' : 'Desktop'}</td></tr>
                </table>
            </body>
            </html>
        `;

        res.send(html);
    } catch (error) {
        res.status(500).send(`Error fetching information: ${error.message}`);
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
