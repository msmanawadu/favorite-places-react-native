import * as SQLite from 'expo-sqlite';

const database = SQLite.openDatabase('places.db');

//SQLite DB setup
export function init() {
	database.transaction((tx) => {
		tx.executeSql(``);
	});
}
