
import * as admin from 'firebase-admin';

// IMPORTANT: Your service account key JSON has been hardcoded here.
// This is a security risk. It is strongly recommended to use environment variables.
const serviceAccountKey = "'{"type": "service_account", "project_id": "visionhub-8337b", "private_key_id": "95d696bb6e93b25a702463e9ef2111368fe092a9", "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDP0IuxotkkTfjV\nMwuggVLwCC46yIChiTj4PHdWU7Et/i6iNQo2DQUge1VKnc4rGTKQBkAGUIcHRZCg\nSadzU6g8bjpfvVQEcoKEf5H8R/K3NTHevmqdvnH84SdMHJ1T6T3ttwKxZ1+/cQr2\nYXtEWPjDpTBJJSlfn5Uhwb8NJWnIgT/ub3YVi7ETfXTCNK8596uTnmxXIIwzphGN\ndDrtXDIVlOplkaGzIrAFjlryRdZECjNSg2VBdAc4l/BtOTZ4gMGxQ23m5KBUNLSA\nq44g4il/nqAAcLFRoYHOC2jBZm52axmz1raalEnIpPzu6/NuZu/D7x0qify1VEZ5\ncVNnTOjvAgMBAAECggEAEvXwoPL+Q+E3WGBxaaITCqJ8cVGU5ugpwgBmVQKK0mr0\nH0melmLmull2ZTnzsxv38IsZcVoMj93Jfc5qkEusOGNIQS75iPRXszYegDmiTBP2\n6l9OQ/k51jxGxRuBQUQxKcy+WqhXZJSwTt2DDS/e9p7OQoY4+agKR8uxHkZxGeGC\n7Wcw4wmXSC/nW9r1jOqLc5A59YI7dFkPCh8cEyst3TzwYitP6R+NakIUreGdAAtE\nYvKdqMhan10BwoC+g5yMagmK6HPpXbtyb4Srd+PJ/TDF+BpQ76WIIA9bFM09Bv/4\nUaYe01rjdg+VcuTSEHTpua06Bi5yFkzN/u6X/Er2RQKBgQDxS7N2cX+sNLJci4Va\nZ7E3lAqSiu4W2iv1KrchlO+y19veGiABHHDC341hPwXcDNNdg6MVFr1h9WAQrQPs\n3rBkjxanOwdfi/Hl+PPKpjfYUVKOMa+/cI0Bkn7yjUO80tH+Qc+8LU3zWeHQXAdT\n8AySgreHIaVV5LqA9aFJ6pG/LQKBgQDceocnrrrPg3GoCFkAyPAa5mVa3lzuL4UN\n7bl5EDAAPXP20cLXDKrsv/WW/x+StWpSGzYrgH0WbeWwdqfEwimVuoFVftqrrha+\nu9ERDbz3o3GLox12QijpOjjn/mQ/cl0BbnR5MnDLZlkE3aIHfukYR33E8LSEtC1x\nL0ZPtI+6CwKBgG1gPjIjUpcxr+PpToJjXF5wGbbBiRkMvj48pZRwWZL86+oqd3Vp\neeerw/9fvP05RxotkF//1cqwmmIUuyHE87oxbjhRto7l9bmj9oZWgBvrCPvxo9Oo\nZhJfYHH7/Md73LpfBJYtBxeXF5gGD0BKILjMzfpQEwzzSGMqdHj3/iblAoGBAIiV\n/5S90k0sCQUn5rttwBFqGfApQTjth2gRlY1CUfpUF7sYR7QhzOHOKb7ZXh3s9WjY\nIr7gYp26h0jCuTxTbJ+tYuIsLBufRcfzYplGAYMIZhczfdT9N4sE3qwaFNCZcLSq\nUM2kSew4A33YL8ClBpJb97ZByBNN67jqqIxIN6HxAoGBAL39EXStCNAVbXvNZYGl\nmH8RI0YUXfXB76RpwIsWJ9Dtkal5BLV3ylxO+iK9ZACTaTix3OY1L++oFmvd5YUb\nRVondzW++vFPHB0BpfwEDxRGLC5CGRCSgu+AWsdDGTvLJnLg/sNSJHwIbJ88Rmsv\nuGGfX7kFjFv5kNfgBVQlKSUN\n-----END PRIVATE KEY-----\n", "client_email": "firebase-adminsdk-fbsvc@visionhub-8337b.iam.gserviceaccount.com", "client_id": "111331876004726567757", "auth_uri": "https://accounts.google.com/o/oauth2/auth", "token_uri": "https://oauth2.googleapis.com/token", "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs", "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40visionhub-8337b.iam.gserviceaccount.com", "universe_domain": "googleapis.com"}'";

// Check if the app is already initialized
if (!admin.apps.length) {
    try {
        const serviceAccount = JSON.parse(serviceAccountKey);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: "visionhub-8337b.firebasestorage.app",
        });
        console.log("Firebase Admin SDK initialized with hardcoded service account key.");
    } catch (e) {
        console.error("Failed to parse or use hardcoded Firebase service account key. Please ensure it is a valid JSON object:", e);
    }
}

export const firestore = admin.apps.length ? admin.firestore() : null;
export const storage = admin.apps.length ? admin.storage().bucket() : null;
