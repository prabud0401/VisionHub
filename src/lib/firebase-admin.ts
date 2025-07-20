
import * as admin from 'firebase-admin';

// IMPORTANT: Your service account key JSON has been hardcoded here.
// This is a security risk. It is strongly recommended to use environment variables.
const serviceAccountKey = {"type": "service_account", "project_id": "visionhub-d7qr5", "private_key_id": "0a8b1fa4ba2fa88ae32975e46f7d0f5ca3ebaa46", "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCz1RCg8ZV2LphD\nitoLbmDe9o1qwlkm5F3uO5eEHmSAGld/7gWz2toffRqNA4d1KAZwS51nGwM/9pSY\nRqJzjwF6I55LAsz5Uh4cBEeFZmz7lFDea0aLohK2q9ZLUwaqjn9Rszn7zR+sKUso\nu3dlaHvK0lq2phDtoMQSokQ9SJq/Ln2nAfYhcalyxdgInzzge12Ga5Ppbay8nKOA\nKRl3L87oR+cJg2b1cHaO0c7IAQ2IgDom9fsICMddpTvw41k2RpSY2VRB4si7Tkei\nWF8BSyOcNU4Fki3lEsfkqnCSxHkKLU61bux7fwtr5srmCyb+RjWmJRGnjlvoS/x7\njtv5OKZnAgMBAAECggEADk5FT+BYCPpE756UoPMrbqFDd7o1OGRTWpfQAlkempg9\n3LX1Ky0eTAH6QjyFIptIA9foEiMye3ykroZz9uhp8Cr0NThoUO8o6QaoH+MZiVvv\noPn8ty/x+CksV3qn3ZqPY1L0KmVTfzEbwwZCxcTtkCFyyPPmBdlTr73L2uozMUEh\ng6JxfRsn6zl5YPEvbOlS42gGwXWpsUrhqjkenkeomwiUFyO+7vg3lz2z3oivu7y/\nJbc2vQMVMnWhXcCFNRGaRuIB+L0M6JlkulVbKfpcGH4fObxRFhrKiltYy3I7r0cw\nGxxTVcM1w1IDmOiFaE7q8sb9jhbJ6h/QDX9b1ktd2QKBgQD5jvvMAFJJMt2p9xRZ\nMoVNRYP5N6XngxIFoFrV+0KwTCFKMSapCeNiOVhrJVSFqtwT1q7h2WG/ONC6ENc9\ngyvZSlvPElbxLJLimQKzw/IX+6Uq9IttAUwLPIbZH+CWmbQoYSipiWUpF4XR0GiA\nNg+yDrTACAnW2Y7Dep31gQpd3wKBgQC4eVlQn7pxZH6BLhGDNhzER4mvr9H59sHi\ncRzpCm9Y3JC4A1w5AvEAbK+FKU/7gf2rrhJjZAlZ0zqaA+X0+jDV8iM5+NHOlr7d\nbTTkgJGutNtHYqiVBRMJTL0hUQHt54fJx4XzfgTLAQlzTnEqF7hBwk8VipUwrYct\nAdqQ/2a4eQKBgQC1zfSiKZnIucXCjL3GPYffQ0VhyaiTgGkgsDF8sg9jYBLgee4w\nN4PvitdfN1LcDh1GVqAQ6MzNAhcNdjdYGLdZFVLNCA9Oo6peahoN3DICRtGM+ZqZ\nTtiXVwDmLNLw5AjbYey9ldqclQZoU+vNe5TzosMLItAINXZL8ogg0mE7AQKBgCH9\n2kNM62Hxjo3nGzr+QZa5R9mjoCFbIqbDCPy3+4R4QAJoPBoVPKtDW6RB1IcXkNKN\npL3DtSVkEqxGg5z8bPs/PtZzztUuWcUbVl+0gSOcF7uzpjSvVq6kAUWeU6iuvQql\nRT10vxVY/5DLp3aGIGGdmEzz2EG79+iHKusE5LyhAoGATekAQmd2W4ik86wLTpVI\nQBMNxJQGo+4EgWqC87BgKnYVhtS/zCHqamgfi0+pQ6h3Dl3h5NNBeju3/d3SpA7H\nuBA69ryGhUWA2DHdGp5jN2+D/jPWl82/+wzm0Ir8ct+0+xK11VdBrIdQlku7hEqu\nWlMtwqengWaaOoYj9bKv3Ko=\n-----END PRIVATE KEY-----\n", "client_email": "firebase-adminsdk-fbsvc@visionhub-d7qr5.iam.gserviceaccount.com", "client_id": "116931563588813997403", "auth_uri": "https://accounts.google.com/o/oauth2/auth", "token_uri": "https://oauth2.googleapis.com/token", "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs", "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40visionhub-d7qr5.iam.gserviceaccount.com", "universe_domain": "googleapis.com"};

// Check if the app is already initialized
if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccountKey),
            storageBucket: "visionhub-d7qr5.firebasestorage.app",
        });
        console.log("Firebase Admin SDK initialized with hardcoded service account key.");
    } catch (e) {
        console.error("Failed to parse or use hardcoded Firebase service account key. Please ensure it is a valid JSON object:", e);
    }
}

export const firestore = admin.apps.length ? admin.firestore() : null;
export const storage = admin.apps.length ? admin.storage().bucket() : null;
