import * as SQLite from 'expo-sqlite';

import { Place } from '../models/place';
const database = SQLite.openDatabaseSync('places.db');
export function init() {
	return database.runAsync(`
		CREATE TABLE IF NOT EXISTS places (
 		id INTEGER PRIMARY KEY NOT NULL,
 		title TEXT NOT NULL,
 		imageUri TEXT NOT NULL,
 		address TEXT NOT NULL,
  	latitude REAL NOT NULL,
 		longitude REAL NOT NULL
 )
`);
}
export function insertPlace(place) {
	return database.runAsync(
		`INSERT INTO places (title, imageUri, address, latitude, longitude) VALUES (?, ?, ?, ?, ?)`,
		[
			place.title,
			place.imageUri,
			place.address,
			place.location.latitude,
			place.location.longitude,
		]
	);
}
export async function fetchPlaces() {
	const result = await database.getAllAsync('SELECT * FROM places');
	const places = [];
	// Transform list of results into list of place objects
	for (const dataPoint of result) {
		places.push(
			new Place(
				dataPoint.title,
				dataPoint.imageUri,
				{
					address: dataPoint.address,
					latitude: dataPoint.latitude,
					longitude: dataPoint.longitude,
				},
				dataPoint.id
			)
		);
	}
	return places;
}
export async function fetchPlaceDetails(id) {
	const dbPlace = await database.getFirstAsync(
		'SELECT * FROM places WHERE id = ?',
		[id]
	);
	// Transform query result into a place object
	const place = new Place(
		dbPlace.title,
		dbPlace.imageUri,
		{
			latitude: dbPlace.latitude,
			longitude: dbPlace.longitude,
			address: dbPlace.address,
		},
		dbPlace.id
	);
	return place;
}
