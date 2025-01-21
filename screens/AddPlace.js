import PlaceForm from '../components/Places/PlaceForm';
import { insertPlace } from '../util/database';

function AddPlace({ navigation }) {
	function createPlaceHandler(place) {
		// Write to DB
		insertPlace(place)
			.then((result) => {})
			.catch((error) => {
				console.log(error);
			});

		navigation.popTo('AllPlaces');
	}

	return <PlaceForm onCreatePlace={createPlaceHandler} />;
}

export default AddPlace;
