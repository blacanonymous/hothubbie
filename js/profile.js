fetch('/firebase-config')
    .then(response => response.json())
    .then(config => {
        firebase.initializeApp(config);
        const auth = firebase.auth();
        const db = firebase.firestore();

        auth.onAuthStateChanged((user) => {
            if (user) {
                document.getElementById('user-name').textContent = user.displayName || 'N/A';
                document.getElementById('user-email').textContent = user.email || 'N/A';
                if (user.photoURL) {
                    document.getElementById('profile-pic').src = user.photoURL;
                    document.getElementById('profile-pic').style.display = 'block';
                }
                db.collection('users').doc(user.uid).set({
                    name: user.displayName,
                    email: user.email,
                    uid: user.uid,
                    lastLogin: firebase.firestore.FieldValue.serverTimestamp()
                }, { merge: true })
                .catch((error) => {
                    console.error('Error writing to Firestore:', error);
                });
            } else {
                window.location.href = '/';
            }
        });

        document.getElementById('signout').addEventListener('click', () => {
            auth.signOut().then(() => {
                window.location.href = '/';
            });
        });
    })
    .catch(error => {
        console.error('Error fetching Firebase config:', error);
    });