import { StyleSheet, View, Alert } from 'react-native';
import OutlinedButton from '../UI/OutlinedButton';
import { Colors } from '../../constants/colors';
import {
	getCurrentPositionAsync,
	useForegroundPermissions,
	PermissionStatus,
} from 'expo-location';

function LocationPicker() {
	const [locationPermissionInformation, requestPermission] =
		useForegroundPermissions();

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

		//Fetch current geo-location
		const location = await getCurrentPositionAsync();
		console.log(location);
	}

	function pickOnMapHandler() {}

	return (
		<View>
			<View style={styles.mapPreview}></View>
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
	},
	actions: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
	},
});

export default LocationPicker;
