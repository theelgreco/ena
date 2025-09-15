import { app } from "../init";
import { getStorage, ref, listAll, getDownloadURL, connectStorageEmulator } from "firebase/storage";

const storage = process.env.NODE_ENV === "production" ? getStorage(app, app.storageBucket) : getStorage();

if (process.env.NODE_ENV !== "production") {
  connectStorageEmulator(storage, "127.0.0.1", 9199);
}

export const iconsRef = ref(storage, "icons");

export const getAllIcons = async () => {
  const urls = [];
  const { items } = await listAll(iconsRef);

  for (const item of items) {
    const url = await getDownloadURL(item);
    urls.push(url);
  }

  return urls;
};
