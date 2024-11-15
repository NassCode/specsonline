(async function collectAndSendClientInfo() {
    const clientInfo = {
        browser: navigator.userAgent,
        platform: navigator.platform,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        deviceMemory: navigator.deviceMemory || 'Unknown',
        cores: navigator.hardwareConcurrency || 'Unknown',
        language: navigator.language || 'Unknown',
        touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        cookiesEnabled: navigator.cookieEnabled || false,
        gpuVendor: 'Unknown',
        gpuRenderer: 'Unknown',
    };

    // Attempt to fetch GPU info using WebGL
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                clientInfo.gpuVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
                clientInfo.gpuRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            }
        }
    } catch (error) {
        console.error('Error fetching GPU info:', error);
    }

    try {
        const response = await fetch('/client-info', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(clientInfo),
        });

        const html = await response.text();
        document.open();
        document.write(html);
        document.close();
    } catch (error) {
        console.error('Error sending client info:', error);
    }
})();
