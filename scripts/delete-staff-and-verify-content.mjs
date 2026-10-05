import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const readEnv = () => {
  const envPath = path.join(root, ".env");
  const env = {};

  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const index = trimmed.indexOf("=");
    if (index === -1) continue;

    env[trimmed.slice(0, index)] = trimmed.slice(index + 1);
  }

  return env;
};

const env = readEnv();
const projectId = env.VITE_FIREBASE_PROJECT_ID;
const apiKey = env.VITE_FIREBASE_API_KEY;
const baseUrl =
  `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;

const getAuthToken = async () => {
  const email = env.FIREBASE_IMPORT_EMAIL || env.VITE_ADMIN_EMAIL;
  const password = env.FIREBASE_IMPORT_PASSWORD || env.VITE_FIREBASE_SERVICE_SECRET;

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    }
  );

  const data = await response.json();
  if (!response.ok || !data.idToken) {
    throw new Error(`Firebase Auth failed: ${JSON.stringify(data.error || data)}`);
  }

  console.log(`Authenticated as ${email}`);
  return data.idToken;
};

const authToken = await getAuthToken();
const headers = { Authorization: `Bearer ${authToken}` };

const listDocs = async (collectionName) => {
  const response = await fetch(`${baseUrl}/${collectionName}?key=${apiKey}`, {
    headers,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${collectionName}: list failed ${response.status} ${body}`);
  }

  const data = await response.json();
  return data.documents || [];
};

const deleteDoc = async (documentName) => {
  const response = await fetch(`${baseUrl}/${documentName.split("/documents/")[1]}?key=${apiKey}`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok && response.status !== 404) {
    const body = await response.text();
    throw new Error(`${documentName}: delete failed ${response.status} ${body}`);
  }
};

const staffDocs = await listDocs("staff");
for (const doc of staffDocs) {
  await deleteDoc(doc.name);
}

console.log(`staff: ${staffDocs.length} documents deleted`);

for (const collectionName of ["services", "treatments", "tools"]) {
  const docs = await listDocs(collectionName);
  const first = docs[0]?.fields || {};
  const hasContent =
    Boolean(first.description?.stringValue) ||
    Boolean(first.summary?.stringValue) ||
    Boolean(first.contentHtml?.stringValue);

  console.log(`${collectionName}: ${docs.length} documents found; sample content=${hasContent ? "yes" : "not in first doc"}`);
}
