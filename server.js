const express = require('express');
const useragent = require('express-useragent');

const app = express();
const port = 3000;

// Serve static files
app.use(express.static('public'));

// Middleware to parse JSON data
app.use(express.json());

// Use useragent middleware
app.use(useragent.express());

// Handle client data
app.post('/client-info', (req, res) => {
    const clientData = req.body;

    // Combine client and server data
    const combinedData = {
        "Browser": clientData.browser || 'Unknown',
        "Browser Version": clientData.browserVersion || 'Unknown',
        "Platform": clientData.platform || 'Unknown',
        "Operating System": clientData.operatingSystem || 'Unknown',
        "Screen Resolution": clientData.screenResolution || 'Unknown',
        "Device Memory": clientData.deviceMemory ? `${clientData.deviceMemory} GB` : 'Unknown',
        "CPU Cores": clientData.cores || 'Unknown',
        "User Agent": clientData.userAgent || 'Unknown',
        "Language": clientData.language || navigator.language || 'Unknown',
        "Time Zone": Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown',
        "Touch Support": clientData.touchSupport ? 'Yes' : 'No',
        "Cookies Enabled": clientData.cookiesEnabled ? 'Yes' : 'No',
        "GPU Vendor": clientData.gpuVendor || 'Unknown',
        "GPU Renderer": clientData.gpuRenderer || 'Unknown'
    };

    // Respond with HTML
    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Client Fingerprint Information</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { color: #333; }
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f4f4f4; }
                td { word-break: break-word; }
            </style>
        </head>
        <body>
            <h1>Client Fingerprint Information</h1>
            <table>
                ${Object.entries(combinedData).map(([key, value]) => `
                    <tr>
                        <th>${key}</th>
                        <td>${value}</td>
                    </tr>
                `).join('')}
            </table>
        </body>
        </html>
    `;

    res.send(html);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
