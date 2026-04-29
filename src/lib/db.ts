import { Opinion, Reaction } from "@/src/data/opinions";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const DB_NAME = "blogApp";
const DB_VERSION = 4;
const USERS_STORE = "users";
const OPINIONS_STORE = "opinions";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(USERS_STORE)) {
        db.createObjectStore(USERS_STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(OPINIONS_STORE)) {
        db.createObjectStore(OPINIONS_STORE, { keyPath: "id" });
      }
    };
  });
}

export async function getUsers(): Promise<User[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(USERS_STORE, "readonly");
    const store = transaction.objectStore(USERS_STORE);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

export async function addUser(user: User): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(USERS_STORE, "readwrite");
    const store = transaction.objectStore(USERS_STORE);
    const request = store.add(user);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(USERS_STORE, "readonly");
    const store = transaction.objectStore(USERS_STORE);
    const request = store.openCursor();
    let foundUser: User | undefined;
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const cursor = request.result as IDBCursorWithValue | null;
      if (cursor) {
        const user = cursor.value as User;
        if (user.email === email) {
          foundUser = user;
        }
        cursor.continue();
      } else {
        resolve(foundUser);
      }
    };
  });
}

export async function getOpinions(): Promise<Opinion[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(OPINIONS_STORE, "readonly");
    const store = transaction.objectStore(OPINIONS_STORE);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

export async function addOpinion(opinion: Opinion): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(OPINIONS_STORE, "readwrite");
    const store = transaction.objectStore(OPINIONS_STORE);
    const request = store.add(opinion);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function updateOpinionComments(opinionId: string, comments: Opinion["comments"]): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(OPINIONS_STORE, "readwrite");
    const store = transaction.objectStore(OPINIONS_STORE);
    const getRequest = store.get(opinionId);

    getRequest.onerror = () => reject(getRequest.error);
    getRequest.onsuccess = () => {
      const opinion = getRequest.result;
      if (opinion) {
        opinion.comments = comments;
        const putRequest = store.put(opinion);
        putRequest.onerror = () => reject(putRequest.error);
        putRequest.onsuccess = () => resolve();
      } else {
        reject(new Error("Opinion not found"));
      }
    };
  });
}

export async function updateOpinionReactions(opinionId: string, reactions: Reaction[]): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(OPINIONS_STORE, "readwrite");
    const store = transaction.objectStore(OPINIONS_STORE);
    const getRequest = store.get(opinionId);

    getRequest.onerror = () => reject(getRequest.error);
    getRequest.onsuccess = () => {
      const opinion = getRequest.result;
      if (opinion) {
        opinion.reactions = reactions;
        const putRequest = store.put(opinion);
        putRequest.onerror = () => reject(putRequest.error);
        putRequest.onsuccess = () => resolve();
      } else {
        reject(new Error("Opinion not found"));
      }
    };
  });
}

export async function hasStoredOpinions(): Promise<boolean> {
  const opinions = await getOpinions();
  return opinions.length > 0;
}

export async function initializeMockData(mockOpinions: Opinion[]): Promise<void> {
  for (const opinion of mockOpinions) {
    await addOpinion(opinion);
  }
}
