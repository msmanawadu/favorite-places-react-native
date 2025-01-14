import { Alert, Button, Image, StyleSheet, Text, View } from 'react-native';
import {
	launchCameraAsync,
	useCameraPermissions,
	PermissionStatus,
} from 'expo-image-picker';
import { useState } from 'react';
import { Colors } from '../../constants/colors';

function ImagePicker() {
	const [pickedImage, setPickedImage] = useState(); // To keep track of capturing image
	const [cameraPermissionInformation, requestPermission] =
		useCameraPermissions();

	async function verifyPermissions() {
		//Check permissions to use camera
		if (cameraPermissionInformation.status === PermissionStatus.UNDETERMINED) {
			const permissionResponse = await requestPermission();
			return permissionResponse.granted;
		}

		if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
			const canAsk = cameraPermissionInformation.canAskAgain;
			if (canAsk) {
				const permissionResponse = await requestPermission();
				return permissionResponse.granted;
			} else {
				Alert.alert(
					'Insufficient Permissions!',
					'You need to grant camera permission to use this app.'
				);
				return false;
			}
		}

		//Granted permission to use camera
		return true;
	}

	async function takeImageHandler() {
		const hasPermission = await verifyPermissions();

		if (!hasPermission) {
			return; //Permission denied, skip further execution
		}

		//Launch camera and capture image
		const image = await launchCameraAsync({
			allowsEditing: true,
			aspect: [16, 9],
			quality: 0.5,
		});
		setPickedImage(image.assets[0].uri);
	}

	//Fallback text
	let imagePreview = <Text>No image taken yet.</Text>;

	if (pickedImage) {
		imagePreview = <Image style={styles.image} source={{ uri: pickedImage }} />;
	}
	return (
		<View>
			<View style={styles.imagePreview}>{imagePreview}</View>
			<Button title='Take Image' onPress={takeImageHandler} />
		</View>
	);
}

const styles = StyleSheet.create({
	imagePreview: {
		width: '100%',
		height: 200,
		marginVertical: 8,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Colors.primary100,
		borderRadius: 4,
	},
	image: {
		width: '100%',
		height: '100%',
	},
});

export default ImagePicker;
