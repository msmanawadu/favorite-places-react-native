import { useEffect, useState } from 'react';
import PlacesList from '../components/Places/PlacesList';
import { useIsFocused } from '@react-navigation/native';
import { fetchPlaces } from '../util/database';

function AllPlaces() {
	const [loadedPlaces, setLoadedPlaces] = useState([]); // To keep track of list of places
	const isFocused = useIsFocused();

	useEffect(() => {
		if (isFocused) {
			// Read from DB
			fetchPlaces()
				.then((places) => {
					setLoadedPlaces(places);
				})
				.catch((error) => {
					console.log(error);
				});
		}
	}, [isFocused]);
	return <PlacesList places={loadedPlaces} />;
}

export default AllPlaces;
