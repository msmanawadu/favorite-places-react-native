import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import OutlinedButton from '../components/UI/OutlinedButton';
import { Colors } from '../constants/colors';
import { useEffect, useState } from 'react';
import { fetchPlaceDetails } from '../util/database';

function PlaceDetails({ route, navigation }) {
	const [fetchedPlace, setFetchedPlace] = useState(); // To keep track of fetched place
	function showOnMapHandler() {
		navigation.navigate('Map', {
			initialLatitude: fetchedPlace.location.latitude,
			initialLongitude: fetchedPlace.location.longitude,
		});
	}

	const selectedPlaceId = route.params.placeId;

	useEffect(() => {
		// Read from DB
		fetchPlaceDetails(selectedPlaceId)
			.then((place) => {
				setFetchedPlace(place);
				navigation.setOptions({
					title: place.title,
				});
			})
			.catch((error) => {
				console.log(error);
			});
	}, [selectedPlaceId]);

	if (!fetchedPlace) {
		return (
			<View style={styles.fallback}>
				<Text>Loading place data...</Text>
			</View>
		);
	}
	return (
		<ScrollView>
			<Image style={styles.image} source={{ uri: fetchedPlace.imageUri }} />
			<View style={styles.locationContainer}>
				<View style={styles.addressContainer}>
					<Text style={styles.address}>{fetchedPlace.address}</Text>
				</View>
				<OutlinedButton icon='map' onPress={showOnMapHandler}>
					View on Map
				</OutlinedButton>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	image: {
		height: '35%',
		minHeight: 300,
		width: '100%',
	},
	locationContainer: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	addressContainer: {
		padding: 20,
	},
	address: {
		color: Colors.primary500,
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 16,
	},
	fallback: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default PlaceDetails;
