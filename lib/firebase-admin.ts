
import * as admin from 'firebase-admin';

// IMPORTANT: Your service account key JSON must be updated for your new project.
// This is a security risk. It is strongly recommended to use environment variables.
const serviceAccountKey = {
    "type": "service_account",
    "project_id": "visionhub-uffkz",
    "private_key_id": "afb198372f4391bb24054226194f61333aad1b37",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDVW6iXUHIYk6SM\n1GDUT31OupatWZ9uIOM2DnMnxdeza4V0anOqlhg+iQK0QpvHdHuzGKEmzwc2b/8D\nAQzpm2SNOluyqX6JIyJO8pzw0z7XDXv3VvYv8BOaHRXyOtgU5Hq+6Zw7O5NDLgOo\nYtAKhsKMZgpU7urwJmtmtHolT2n8VJ6FTNhOIq2V+Mo7wjdlchj+Sc6rpSZsSZvl\n31s5oKNc3XT3WXU905DTXu2wVYGEhRtQcnRWc7D+yRpuCJzci8ahzd/9k3gVFEC5\nnjzoBZQTmNb5tRIhiAlh7udjPwVDfBO4M4lHmhR3IDoiPpZscY0AYQNP+fFe6E4e\nhPEgTSGHAgMBAAECggEABL10kWgIIOOm1DojrJPXhNhAYLmNATVZ1umbRVbv49yP\nqnZy+2c6Qqlolfik3VmJJgF2ExamYl86myZ60vXQ1hJl1yJM3V8adAaP1gnba4ux\nJV2ZOpdq2BGtWyRTiKNK1tL51ZcNPoDXM/Z+CL3VtKjPsfNc5Nj1qeJ4lDufbyun\ns5yer+YvYL9Y3o4GIY4F6bvLKZQNE3LmuQ9dVBhymEIANb/NQUH0tz9OpjM+PMga\nqbsPTW/Kv/QkF1t+7/dW4RzT3gjI+kHyd0MPH5O2bTwZJWYCL4jKdR0Pz+3EuFuJ\nksno2YwwJqbWt/8yRybs7xi/3VnlWQVkCJfNDF7HgQKBgQD2sMNjR1ghSEqfiHtU\npM/ROyZyKhxe4rBOmbaGv86z+SESqMh4CYs/c62jbKfHt3emevzSjI2OFUWLlz20\n1SYXco0Qn+KOdQ5P7jRUNW0ZPy7Ha3LtvR4AnOSRL5zYrgIVId2p9DBlzAM33BYf\ngv9LJokNEs50XID54m4uMgrOxQKBgQDdaOBDAE7lG0RjVTrPIl1zaNDrCLSe1Y8S\n7kEGgT55HJkjDdxqu3RHUOtUjH0fEkRpQirmn9xB5uVO7V7mA3r8d76HIGO5RBSV\nJ0cHLeCRKy3cp7nGlR8idPL3FR0jETYjc/b9qbxfZl4srTS5T+qBftKEo4qpgewR\nEp+doDkz2wKBgAxqBMsgMf0qyCaTFbHCwXqEAYFJQTg9LCYochkB2gMQjGuF9uCj\nilBdH+XTd/YC85B7K/HkhNMbmu5VZBOPjmUrrJGjmiEVHu1CzXtXXPAiT9ZVP+la\n1QGu44my3a/BwfUSSTdeRHk69QaAmtRnITXE8Kypv533cb4heO32MrkJAoGAd6Ha\nQvmgp3RTQGTl8NO9sMU61TQP/B6iPvVTV0NwURpduC4eIeGFk58qeLWsSaSiKEmj\nSpen+EfdMQdbFmddBZth7DtZBtq9UFY3r65fP7EYB7jszVr3xrNwMIdNBgyftwpK\ns4cKDHYQfo1cBqEisbOn5hlDrBFST2tDqXTQU68CgYBU4kB6lrJt3JK3EfEgBkq9\nBUJQ/7HHXwIolzaesRt/ajw0uqef3zoxsZ0c+G983LZZl0/LJUp2m+GVJ4y1hgOp\nikGAm2PXuYrJo/d6nHBR4EsgGD1dtaWfkH7tIFBVzdiV2uKASLQS0LC1CSo5VuxK\np+0BaJkkZS1iX/0urI27Mg==\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-fbsvc@visionhub-uffkz.iam.gserviceaccount.com",
    "client_id": "117476003817038054039",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40visionhub-uffkz.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  }

// Check if the app is already initialized
if (!admin.apps.length) {
    try {
        const serviceAccount = JSON.parse(serviceAccountKey);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: "visionhub-d7qr5.firebasestorage.app",
        });
        console.log("Firebase Admin SDK initialized with hardcoded service account key.");
    } catch (e) {
        console.error("Failed to parse or use hardcoded Firebase service account key. Please ensure it is a valid JSON object:", e);
    }
}

export const firestore = admin.apps.length ? admin.firestore() : null;
export const storage = admin.apps.length ? admin.storage().bucket() : null;
