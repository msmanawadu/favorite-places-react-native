import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useCallback, useState } from 'react';
import { init } from './util/database';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AllPlaces from './screens/AllPlaces';
import AddPlace from './screens/AddPlace';
import IconButton from './components/UI/IconButton';
import Map from './screens/Map';
import PlaceDetails from './screens/PlaceDetails';
import { Colors } from './constants/colors';

SplashScreen.preventAutoHideAsync();
const Stack = createNativeStackNavigator();

export default function App() {
	const [dbInitialized, setDbInitialized] = useState(false); // DB initialization state

	//To initialize SQLite DB
	useEffect(() => {
		async function prepare() {
			try {
				await init(); // returns promise
			} catch (error) {
				console.warn(error);
			} finally {
				setDbInitialized(true);
			}
		}
		prepare();
	}, []);

	const onLayoutRootView = useCallback(() => {
		if (dbInitialized) {
			SplashScreen.hide();
		}
	}, [dbInitialized]);

	if (!dbInitialized) {
		return null;
	}

	return (
		<>
			<StatusBar style='dark' />
			<NavigationContainer onReady={onLayoutRootView}>
				<Stack.Navigator
					screenOptions={{
						headerStyle: {
							backgroundColor: Colors.primary500,
						},
						headerTintColor: Colors.gray700,
						contentStyle: {
							backgroundColor: Colors.gray700,
						},
					}}
				>
					<Stack.Screen
						name='AllPlaces'
						component={AllPlaces}
						options={({ navigation }) => ({
							title: 'Your Favorite Places',
							headerRight: ({ tintColor }) => (
								<IconButton
									icon='add'
									size={24}
									color={tintColor}
									onPress={() => navigation.navigate('AddPlace')}
								/>
							),
						})}
					/>
					<Stack.Screen
						name='AddPlace'
						component={AddPlace}
						options={{
							title: 'Add a new Place',
						}}
					/>
					<Stack.Screen name='Map' component={Map} />
					<Stack.Screen
						name='PlaceDetails'
						component={PlaceDetails}
						options={{
							title: 'Loading Place...',
						}}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		</>
	);
}
