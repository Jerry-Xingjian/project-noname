function localGet(key) {
  const value = window.localStorage.getItem(key);
  try {
    return JSON.parse(window.localStorage.getItem(key));
  } catch (error) {
    return value;
  }
}

function localSet(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function localRemove(key) {
  window.localStorage.removeItem(key);
}

export { localGet, localSet, localRemove };
