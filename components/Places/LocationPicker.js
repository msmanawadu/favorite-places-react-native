import { useEffect, useState } from 'react';
import { StyleSheet, View, Alert, Image, Text } from 'react-native';
import OutlinedButton from '../UI/OutlinedButton';
import { Colors } from '../../constants/colors';
import {
	getCurrentPositionAsync,
	useForegroundPermissions,
	PermissionStatus,
} from 'expo-location';
import { getMapPreview, getAddress } from '../../util/location';
import {
	useNavigation,
	useRoute,
	useIsFocused,
} from '@react-navigation/native';

function LocationPicker({ onPickLocation }) {
	const isFocused = useIsFocused();
	const navigation = useNavigation();
	const [pickedLocation, setPickedLocation] = useState(); // To keep tack of tracing location
	const route = useRoute();

	const [locationPermissionInformation, requestPermission] =
		useForegroundPermissions();

	//Conditionally update location state with receiving route params from Map Screen -> For 'Pick on Map' button
	useEffect(() => {
		if (isFocused && route.params) {
			const mapPickedLocation = {
				latitude: route.params.pickedLatitude,
				longitude: route.params.pickedLongitude,
			};
			setPickedLocation(mapPickedLocation);
		}
	}, [route, isFocused]);

	//To call 'onPickLocation' whenever pickedLocation state changes
	useEffect(() => {
		async function handleLocation() {
			if (pickedLocation) {
				const address = await getAddress(
					pickedLocation.longitude,
					pickedLocation.latitude
				);
				onPickLocation({ ...pickedLocation, address: address });
			}
		}
		handleLocation();
	}, [pickedLocation, onPickLocation]);

	async function verifyPermissions() {
		//Check permissions to access device location
		if (
			locationPermissionInformation.status === PermissionStatus.UNDETERMINED
		) {
			const permissionResponse = await requestPermission();
			return permissionResponse.granted;
		}

		if (locationPermissionInformation.status === PermissionStatus.DENIED) {
			const canAsk = locationPermissionInformation.canAskAgain;
			if (canAsk) {
				const permissionResponse = await requestPermission();
				return permissionResponse.granted;
			} else {
				Alert.alert(
					'Insufficient Permissions!',
					'You need to grant permission to access device location to use this app.'
				);
				return false;
			}
		}

		//Granted permission to access device location
		return true;
	}

	async function getLocationHandler() {
		const hasPermission = await verifyPermissions();
		if (!hasPermission) {
			return; //Permission denied, skip further execution
		}

		//Fetch current geo-location -> For 'Locate User' button
		const location = await getCurrentPositionAsync();
		setPickedLocation({
			longitude: location.coords.longitude,
			latitude: location.coords.latitude,
		});
	}

	function pickOnMapHandler() {
		navigation.push('Map');
	}

	//Fallback Text
	let locationPreview = <Text>No location picked yet.</Text>;

	if (pickedLocation) {
		let staticMapImageUrl = getMapPreview(
			pickedLocation.longitude,
			pickedLocation.latitude
		);

		locationPreview = (
			<Image style={styles.image} source={{ uri: staticMapImageUrl }} />
		);
	}

	return (
		<View>
			<View style={styles.mapPreview}>{locationPreview}</View>
			<View style={styles.actions}>
				<OutlinedButton onPress={getLocationHandler} icon='location'>
					Locate User
				</OutlinedButton>
				<OutlinedButton onPress={pickOnMapHandler} icon='map'>
					Pick on Map
				</OutlinedButton>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	mapPreview: {
		width: '100%',
		height: 200,
		marginVertical: 8,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Colors.primary100,
		borderRadius: 4,
		overflow: 'hidden',
	},
	actions: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
	},
	image: {
		width: '100%',
		height: '100%',
		//borderRadius:4,
	},
});

export default LocationPicker;
