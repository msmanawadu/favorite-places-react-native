const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL;
const apiKey = process.env.EXPO_PUBLIC_API_KEY;

export function getMapPreview(lon, lat) {
	let longitude = lon;
	let latitude = lat;

	const imagePreviewUrl = `${apiBaseUrl}?style=osm-bright&width=600&height=400&center=lonlat:${longitude},${latitude}&zoom=15&marker=lonlat:${longitude},${latitude};type:material;color:red;size:x-large;icontype:awesome&apiKey=${apiKey}`;

	return imagePreviewUrl;
}
