# Firebase Index Setup Instructions

## Fix for Payment Query Error

You're seeing this error because Firebase needs a composite index for the payments collection:

```
Error: The query requires an index. You can create it here: https://console.firebase.google.com/v1/r/project/visionhub-uffkz/firestore/indexes
```

## Option 1: Automatic (Click the Link)
1. Click the link in the error message in your terminal
2. It will take you directly to Firebase Console with the index pre-configured
3. Click "Create Index"
4. Wait for it to build (usually 1-2 minutes)

## Option 2: Manual Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `visionhub-uffkz`
3. Go to **Firestore Database** → **Indexes** → **Composite**
4. Click **Create Index**
5. Configure:
   - **Collection ID**: `payments`
   - **Fields to index**:
     - `userId` (Ascending)
     - `createdAt` (Descending)
   - **Query Scopes**: Collection
6. Click **Create**

## Option 3: Deploy from Code
Run this command in your project directory:
```bash
npx firebase-tools deploy --only firestore:indexes
```

## Current Index Configuration
Your `firebase.indexes.json` already has the correct configuration:
```json
{
  "collectionGroup": "payments",
  "queryScope": "COLLECTION", 
  "fields": [
    { "fieldPath": "userId", "order": "ASCENDING" },
    { "fieldPath": "createdAt", "order": "DESCENDING" }
  ]
}
```

## After Index Creation
Once the index is built, the error will disappear and the settings page will work properly.

---

## Note about Webpack Warnings
The handlebars and opentelemetry warnings are normal for the genkit dependencies and don't affect functionality. They're just build warnings that can be ignored. 