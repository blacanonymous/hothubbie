addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    const url = new URL(request.url);
    let filePath = url.pathname;

    // Serve Firebase config from environment variables
    if (filePath === '/firebase-config') {
        const firebaseConfig = {
            apiKey: env.FIREBASE_API_KEY,
            authDomain: env.FIREBASE_AUTH_DOMAIN,
            projectId: env.FIREBASE_PROJECT_ID,
            storageBucket: env.FIREBASE_STORAGE_BUCKET,
            messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
            appId: env.FIREBASE_APP_ID,
            measurementId: env.FIREBASE_MEASUREMENT_ID
        };
        return new Response(JSON.stringify(firebaseConfig), {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // Map paths to files
    const fileMap = {
        '/': '/html/index.html',
        '/index.html': '/html/index.html',
        '/profile': '/html/profile.html',
        '/profile.html': '/html/profile.html',
        '/css/login.css': '/css/login.css',
        '/css/profile.css': '/css/profile.css',
        '/js/login.js': '/js/login.js',
        '/js/profile.js': '/js/profile.js'
    };

    filePath = fileMap[filePath] || filePath;

    try {
        const response = await fetch(`https://hothubbie-assets.workers.dev${filePath}`);
        return new Response(response.body, {
            headers: {
                'Content-Type': getContentType(filePath),
                'Cache-Control': 'no-cache'
            }
        });
    } catch (e) {
        return new Response('File not found', { status: 404 });
    }
}

function getContentType(filePath) {
    if (filePath.endsWith('.html')) return 'text/html';
    if (filePath.endsWith('.css')) return 'text/css';
    if (filePath.endsWith('.js')) return 'application/javascript';
    return 'text/plain';
}