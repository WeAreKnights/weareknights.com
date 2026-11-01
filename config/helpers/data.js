// Data helpers: strip empty values from JSON-LD objects and format postal addresses.

/**
 * Removes empty strings, null, undefined and empty arrays/objects, recursively, so JSON-LD has no blank fields.
 * @param {unknown} value
 * @returns {unknown} The cleaned value, or undefined if nothing is left
 */
export function omitEmpty(value) {
	if (Array.isArray(value)) {
		const array = value.map(omitEmpty).filter((item) => item !== undefined);
		return array.length ? array : undefined;
	}

	if (value && typeof value === "object") {
		const object = {};
		for (const [key, entryValue] of Object.entries(value)) {
			const cleaned = omitEmpty(entryValue);
			if (cleaned !== undefined) object[key] = cleaned;
		}
		return Object.keys(object).length ? object : undefined;
	}

	return value === "" || value === null || value === undefined ? undefined : value;
}

/**
 * @param {{ street?: string, city?: string, region?: string, postalCode?: string }} [address]
 * @returns {string} A one-line address, or an empty string when there is none
 */
export function formatAddress(address) {
	if (!address) return "";
	const hasAddress = [address.street, address.city, address.region, address.postalCode].some(Boolean);
	if (!hasAddress) return "";
	return [address.street, address.city, address.region, address.postalCode, address.country].filter(Boolean).join(", ");
}
