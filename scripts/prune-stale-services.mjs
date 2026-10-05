import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

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

const getImportedAssetMap = (source) => {
  const assets = {};
  const importRegex = /import\s+(\w+)\s+from\s+["']([^"']+)["'];/g;
  let match;

  while ((match = importRegex.exec(source))) {
    assets[match[1]] = match[2];
  }

  return assets;
};

const extractConstExpression = (source, constName) => {
  const marker = `const ${constName}`;
  const start = source.indexOf(marker);
  if (start === -1) throw new Error(`Unable to find ${constName}`);

  const equals = source.indexOf("=", start);
  const expressionStart = source.indexOf("[", equals);
  let depth = 0;

  for (let i = expressionStart; i < source.length; i += 1) {
    if (source[i] === "[") depth += 1;
    if (source[i] === "]") depth -= 1;

    if (depth === 0) {
      return source.slice(equals + 1, i + 1);
    }
  }

  throw new Error(`Unable to parse ${constName}`);
};

const loadServices = () => {
  const filePath = path.join(root, "src", "data", "servicesData.js");
  const source = fs.readFileSync(filePath, "utf8");
  const assets = getImportedAssetMap(source);
  const expression = extractConstExpression(
    source.replace("export const ALL_SERVICES", "const ALL_SERVICES"),
    "ALL_SERVICES"
  );
  const context = vm.createContext({ ...assets });
  const script = new vm.Script(`result = ${expression}`);
  script.runInContext(context);

  return context.result;
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

const canonicalServices = loadServices();
const canonicalIds = new Set(
  canonicalServices.map((service) => String(service.id || service.slug || service.title))
);

const authToken = await getAuthToken();
const headers = { Authorization: `Bearer ${authToken}` };

const listResponse = await fetch(`${baseUrl}/services?key=${apiKey}`, {
  headers,
});

if (!listResponse.ok) {
  const body = await listResponse.text();
  throw new Error(`services list failed: ${listResponse.status} ${body}`);
}

const listData = await listResponse.json();
const serviceDocs = listData.documents || [];
const staleDocs = serviceDocs.filter((doc) => {
  const id = doc.name.split("/").pop();
  return !canonicalIds.has(id);
});

for (const staleDoc of staleDocs) {
  const docPath = staleDoc.name.split("/documents/")[1];
  const deleteResponse = await fetch(`${baseUrl}/${docPath}?key=${apiKey}`, {
    method: "DELETE",
    headers,
  });

  if (!deleteResponse.ok && deleteResponse.status !== 404) {
    const body = await deleteResponse.text();
    throw new Error(`${docPath}: delete failed ${deleteResponse.status} ${body}`);
  }

  console.log(`deleted stale service: ${docPath.split("/").pop()}`);
}

const verifyResponse = await fetch(`${baseUrl}/services?key=${apiKey}`, {
  headers,
});
const verifyData = await verifyResponse.json();
const remainingCount = verifyData.documents?.length || 0;

console.log(`canonical services: ${canonicalIds.size}`);
console.log(`stale services deleted: ${staleDocs.length}`);
console.log(`services remaining in Firestore: ${remainingCount}`);
