import localForage from "localforage";
import NodeCache from "node-cache";

export default class Cache {
  static instance;

  static {
    if (typeof window === "undefined") {
      Cache.instance = new NodeCache();
    } else {
      Cache.instance = localForage.createInstance({
        driver: localForage.INDEXEDDB,
        name: "blckk",
        version: 1.0,
      });
    }
  }

  static async setItem(key, value, expiry) {
    if (typeof window === "undefined") {
      Cache.instance.set(key, value, expiry);
    } else {
      const item = {
        value,
        expiry: expiry ? Date.now() + expiry * 1000 : null,
      };

      return Cache.instance.setItem(key, item);
    }
  }

  static async getItem(key) {
    try {
      if (typeof window === "undefined") {
        const item = Cache.instance.get(key);
        return item;
      } else {
        const item = await Cache.instance.getItem(key);

        if (!item) {
          return null;
        }

        if (item.expiry && Date.now() > item.expiry) {
          await Cache.removeItem(key);
          return null;
        }

        return item.value;
      }
    } catch {
      return null;
    }
  }

  static async removeItem(key) {
    if (typeof window === "undefined") {
      Cache.instance.del(key);
    } else {
      return Cache.instance.removeItem(key);
    }
  }
}
