import type { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";

const maxAge = 60 * 60 * 24 * 30;

type CookieFn = (
	c: Context,
	key: string, 
	fn: () => Promise<string>,
) => Promise<string>;

type KvFn = (
	kv: Deno.Kv,
	key: Deno.KvKey,
	fn: () => Promise<string | Deno.KvEntryMaybe<unknown>>,
) => Promise<string | Deno.KvEntryMaybe<unknown>>;

type KvCookieFn = (
	c: Context,
	kv: Deno.Kv,
	key: Deno.KvKey,
	fn: () => Promise<string | Deno.KvEntryMaybe<unknown>>,
) => Promise<string | Deno.KvEntryMaybe<unknown>>;

export const cookieCache: CookieFn = async (c, key, fn) => {
	const cache = getCookie(c, key);
	if (cache) {
		return cache;
	}
	const response = await fn();
  
	setCookie(c, key, response, { maxAge });
	return response;
};

export const kvCache: KvFn = async (kv, key, fn) => {
	const cache = await kv.get(key);
	if (cache) {
		return cache;
	}
	const response = await fn();

	await kv.set(key, response);
	return response;
};

export const kvCookieCache: KvCookieFn = async (c, kv, key, fn) => {
	const cacheKv = await kv.get(key);
	if (cacheKv) return cacheKv;

	const strKey = typeof key === "string" ? key : JSON.stringify(key);
	const cacheCookie = getCookie(c, strKey);
	if (cacheCookie) {
		await kv.set(key, cacheCookie);
		return cacheCookie;
	}

	const response = await fn();
	const strResponse =
		typeof response === "string" ? response : JSON.stringify(response);
	setCookie(c, strKey, strResponse, { maxAge });
	return response;
};

export const cookieKvCache: KvCookieFn = async (c, kv, key, fn) => {
	const strKey = typeof key === "string" ? key : JSON.stringify(key);
	const cacheCookie = getCookie(c, strKey);
	if (cacheCookie) return cacheCookie;

	const cacheKv = await kv.get(key);
	if (cacheKv) {
		const strResponse =
			typeof cacheKv === "string" ? cacheKv : JSON.stringify(cacheKv);
		setCookie(c, strKey, strResponse, { maxAge });
		return cacheKv;
	}

	const response = await fn();
	await kv.set(key, response);
	const strResponse =
		typeof response === "string" ? response : JSON.stringify(response);
	setCookie(c, strKey, strResponse, { maxAge });
	return response;
};
