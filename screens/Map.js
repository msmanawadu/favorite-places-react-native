import { useCallback, useLayoutEffect, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import IconButton from '../components/UI/IconButton';

function Map({ navigation }) {
	const [selectedLocation, setSelectedLocation] = useState();

	const region = {
		latitude: 37.78,
		longitude: -122.43,
		latitudeDelta: 0.0922,
		longitudeDelta: 0.0421,
	};

	function selectLocationHandler(event) {
		const latitude = event.nativeEvent.coordinate.latitude;
		const longitude = event.nativeEvent.coordinate.longitude;

		setSelectedLocation({
			latitude: latitude,
			longitude: longitude,
		});
	}

	//Avoid dependent function getting executed unnecessarily
	const savePickedLocationHandler = useCallback(() => {
		if (!selectedLocation) {
			Alert.alert(
				'No location picked!',
				'You have to pick a location (by tapping on the map) first!'
			);
			return;
		}

		navigation.popTo('AddPlace', {
			pickedLatitude: selectedLocation.latitude,
			pickedLongitude: selectedLocation.longitude,
		});
	}, [navigation, selectedLocation]);

	//Set navigation header right button
	useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: ({ tintColor }) => (
				<IconButton
					icon='save'
					size={24}
					color={tintColor}
					onPress={savePickedLocationHandler}
				/>
			),
		});
	}, [navigation, savePickedLocationHandler]);

	return (
		<MapView
			style={styles.map}
			initialRegion={region}
			onPress={selectLocationHandler}
		>
			{selectedLocation && (
				<Marker
					title='Picked Location'
					coordinate={{
						latitude: selectedLocation.latitude,
						longitude: selectedLocation.longitude,
					}}
				/>
			)}
		</MapView>
	);
}

const styles = StyleSheet.create({
	map: {
		flex: 1,
	},
});

export default Map;
