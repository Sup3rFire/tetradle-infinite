export class Cache<T extends Record<string, unknown>> {
	private cache: Map<keyof T, { expire: number; value: T[keyof T] }> = new Map();

	private pruneCacheTimeout?: NodeJS.Timeout;
	private pruneCache() {
		if (!this.cache.size) return void (this.pruneCacheTimeout = undefined);
	}

	/**
	 * Cache getter
	 * @param k Key for cached value
	 */
	public get<U extends keyof T>(k: U): T[U] | undefined {
		const cache = this.cache.get(k);
		if (!cache) return undefined;
		if (cache.expire < Date.now()) return undefined;
		return cache.value as T[U];
	}

	/**
	 * Cache setter
	 * @param k Key for cached value
	 * @param v Cached value
	 * @param expire How many milliseconds until it expires
	 */
	public set<U extends keyof T>(k: U, v: T[U], expire: number = 60000) {
		this.cache.set(k, {
			expire: Date.now() + expire,
			value: v
		});

		if (!this.pruneCacheTimeout) {
			this.pruneCacheTimeout = setTimeout(() => {
				this.pruneCache();
			}, 1000);
		}

		return v;
	}
}