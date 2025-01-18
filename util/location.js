const staticMapApiUrl = process.env.EXPO_PUBLIC_STATIC_MAP_API_URL;
const reverseGeocodingApiUrl =
	process.env.EXPO_PUBLIC_REVERSE_GEOCODING_API_URL;
const apiKey = process.env.EXPO_PUBLIC_API_KEY;

export function getMapPreview(lon, lat) {
	const longitude = lon;
	const latitude = lat;

	const imagePreviewUrl = `${staticMapApiUrl}?style=osm-bright&width=600&height=400&center=lonlat:${longitude},${latitude}&zoom=15&marker=lonlat:${longitude},${latitude};type:material;color:red;size:x-large;icontype:awesome&apiKey=${apiKey}`;

	return imagePreviewUrl;
}

export async function getAddress(lon, lat) {
	const longitude = lon;
	const latitude = lat;

	const geocodingApiUrl = `${reverseGeocodingApiUrl}?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`;
	const response = await fetch(geocodingApiUrl);

	if (!response.ok) {
		throw new Error('Failed to fetch address!');
	}

	const data = await response.json();
	const address = data.results[0].formatted;
	return address;
}
