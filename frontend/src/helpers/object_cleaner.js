export function objectCleanerFor(obj) {
  if (typeof obj === "object") {
    if (Object.keys(obj).length === 0) {
      return undefined;
    }

    return Object.fromEntries(
      Object.entries(obj).filter(([key, value]) => {
        return objectCleanerFor(value) !== undefined;
      })
    );
  } else if (Array.isArray(obj) && obj.length > 0) {
    return obj.map((value) => objectCleanerFor(value)).filter((value) => value !== undefined);
  }
  return obj;
}
