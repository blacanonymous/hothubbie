fetch('/firebase-config')
    .then(response => response.json())
    .then(config => {
        firebase.initializeApp(config);
        const auth = firebase.auth();
        const googleProvider = new firebase.auth.GoogleAuthProvider();

        document.getElementById('google-signin').addEventListener('click', () => {
            auth.signInWithPopup(googleProvider)
                .then(() => {
                    window.location.href = '/profile';
                })
                .catch((error) => {
                    document.getElementById('error-message').textContent = error.message;
                });
        });

        auth.onAuthStateChanged((user) => {
            if (user) {
                window.location.href = '/profile';
            }
        });
    })
    .catch(error => {
        console.error('Error fetching Firebase config:', error);
        document.getElementById('error-message').textContent = 'Failed to load Firebase configuration';
    });