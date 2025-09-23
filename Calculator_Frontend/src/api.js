const API = import.meta.env.VITE_API_BASE || "";

async function request(path, opt = {}) {
  const res = await fetch(API + path, {
    headers: { "Content-Type": "application/json", ...(opt.headers || {}) },
    ...opt,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(text || res.statusText);
  return text ? JSON.parse(text) : {};
}

export const post = (path, body) =>
  request(path, { method: "POST", body: JSON.stringify(body) });

export const get = (path) => request(path);
