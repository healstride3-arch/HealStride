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
  if (start === -1) {
    throw new Error(`Unable to find ${constName}`);
  }

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

const loadArray = (relativePath, exportName, constName = exportName) => {
  const filePath = path.join(root, relativePath);
  const source = fs.readFileSync(filePath, "utf8");
  const assets = getImportedAssetMap(source);
  const expression = extractConstExpression(
    source.replace(`export const ${exportName}`, `const ${exportName}`),
    constName
  );
  const context = vm.createContext({ ...assets });
  const script = new vm.Script(`result = ${expression}`);
  script.runInContext(context);

  return context.result;
};

const env = readEnv();
const projectId = env.VITE_FIREBASE_PROJECT_ID;
const apiKey = env.VITE_FIREBASE_API_KEY;
const firestoreBaseUrl =
  `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;

const services = loadArray(
  "src/components/service/ServicesGrid.jsx",
  "defaultServices"
);
const blogs = loadArray("src/data/blogs.js", "blogs");
const doctors = loadArray("src/data/team.js", "doctors");
const staff = doctors;
const galleryItems = loadArray("src/data/galleryItems.js", "galleryItems");
const faqs = loadArray(
  "src/components/about/FAQSection.jsx",
  "defaultFaqs"
);
const reviews = loadArray("src/data/googleReviews.js", "googleReviews");

const settings = {
  address:
    "LIG 85, Raisen Rd, Near Gurudwara, New Subhash Nagar, Ashoka Garden, Bhopal - 462023",
  hours: "Morning 9:00 AM - 12:00 PM\nEvening 5:00 PM - 9:00 PM",
  phone: "+91 88094 91380",
  whatsapp: "+91 82525 80389",
  email: "healstride3@gmail.com",
  instagram: "https://www.instagram.com/healstride.physio/",
  facebook: "https://facebook.com",
  linkedin: "https://linkedin.com",
};

const clean = (value) => JSON.parse(JSON.stringify(value));

const publicAssetDir = path.join(root, "public", "firestore-assets");
fs.mkdirSync(publicAssetDir, { recursive: true });

const copyAssetToPublic = (assetPath) => {
  if (!assetPath.includes("assets/")) {
    return assetPath;
  }

  const normalized = assetPath.replace(/\\/g, "/");
  const assetIndex = normalized.indexOf("assets/");
  const sourcePath = path.join(root, "src", normalized.slice(assetIndex));

  if (!fs.existsSync(sourcePath)) {
    return assetPath;
  }

  const fileName = path.basename(sourcePath);
  fs.copyFileSync(sourcePath, path.join(publicAssetDir, fileName));

  return `/firestore-assets/${fileName}`;
};

const normalizeAssets = (value) => {
  if (Array.isArray(value)) {
    return value.map(normalizeAssets);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, normalizeAssets(entry)])
    );
  }

  if (typeof value === "string") {
    return copyAssetToPublic(value);
  }

  return value;
};

const toFirestoreValue = (value) => {
  if (value === null || value === undefined) {
    return { nullValue: null };
  }

  if (Array.isArray(value)) {
    return {
      arrayValue: {
        values: value.map(toFirestoreValue),
      },
    };
  }

  if (typeof value === "object") {
    return {
      mapValue: {
        fields: toFirestoreFields(value),
      },
    };
  }

  if (typeof value === "boolean") {
    return { booleanValue: value };
  }

  if (typeof value === "number") {
    return Number.isInteger(value)
      ? { integerValue: String(value) }
      : { doubleValue: value };
  }

  return { stringValue: String(value) };
};

const toFirestoreFields = (payload) =>
  Object.fromEntries(
    Object.entries(payload)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [key, toFirestoreValue(value)])
  );

const writeDoc = async (collectionName, id, payload) => {
  const url =
    `${firestoreBaseUrl}/${collectionName}/${encodeURIComponent(id)}?key=${apiKey}`;

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fields: toFirestoreFields(payload),
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${collectionName}/${id}: ${response.status} ${body}`);
  }
};

const writeDocs = async (collectionName, items, mapper = (item) => item) => {
  for (const item of items) {
    const id = String(item.id || item.slug || item.title);
    const payload = normalizeAssets(clean(mapper(item)));
    delete payload.id;

    await writeDoc(collectionName, id, {
      ...payload,
      active: payload.active !== false,
      updatedAt: new Date().toISOString(),
    });
  }

  console.log(`${collectionName}: ${items.length} documents imported`);
};

await writeDocs("services", services);
await writeDocs("blogs", blogs, (blog) => ({
  ...blog,
  slug: blog.slug || String(blog.id),
  coverImage: blog.coverImage || blog.image || "",
  image: blog.image || blog.coverImage || "",
}));
await writeDocs("doctors", doctors);
await writeDocs("staff", staff);
await writeDocs("gallery", galleryItems);
await writeDocs("faqs", faqs);
await writeDocs("testimonials", reviews, (review) => ({
  ...review,
  review: review.review || review.text || "",
  status: "approved",
}));
await writeDoc("settings", "clinic", settings);
console.log("settings/clinic: imported");
console.log("Website data import complete.");
