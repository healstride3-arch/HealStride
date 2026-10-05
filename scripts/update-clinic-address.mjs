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
const apiKey = env.VITE_FIREBASE_API_KEY;
const projectId = env.VITE_FIREBASE_PROJECT_ID;
const authEmail = env.VITE_ADMIN_EMAIL || "admin@stride.in";
const authPassword = env.FIREBASE_IMPORT_PASSWORD || env.VITE_FIREBASE_SERVICE_SECRET || "11111112";

const firestoreBaseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;

const getAuthToken = async () => {
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: authEmail,
        password: authPassword,
        returnSecureToken: true,
      }),
    }
  );

  const data = await response.json();
  if (!response.ok || !data.idToken) {
    throw new Error(`Firebase Auth failed: ${JSON.stringify(data.error || data)}`);
  }
  return data.idToken;
};

const authToken = await getAuthToken();

const updateClinicAddress = async () => {
  const newAddress = "LIG 85 New Subhash Nagar Near Gurudwara-Raisen Road  Bhopal 462023";
  const url = `${firestoreBaseUrl}/settings/clinic?updateMask.fieldPaths=address&key=${apiKey}`;

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      fields: {
        address: { stringValue: newAddress },
      },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Firestore update failed: ${response.status} ${text}`);
  }

  const result = await response.json();
  console.log("Firestore updated successfully:", result.fields?.address);
};

await updateClinicAddress();
