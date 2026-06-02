// ─── App Navigator ────────────────────────────────────────────────────────────
// Root: checks for saved profile → shows Onboarding or Main tabs.

import { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet } from 'react-native';
import { OnboardingScreen } from '@/screens/onboarding/OnboardingScreen';
import { EventsScreen }     from '@/screens/events/EventsScreen';
import { AttendeesScreen }  from '@/screens/attendees/AttendeesScreen';
import { ConnectionsScreen } from '@/screens/connections/ConnectionsScreen';
import { getProfile } from '@/store/profileStore';
import { colors, spacing } from '@/theme';
import type { RootStackParamList, MainTabParamList } from '@/types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab   = createBottomTabNavigator<MainTabParamList>();

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Events: '🗓', Attendees: '👥', Connections: '🤝',
  };
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.4 }}>
      {icons[name] ?? '●'}
    </Text>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor:   colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle:        styles.tabLabel,
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
      })}
    >
      <Tab.Screen name="Events"      component={EventsScreen} />
      <Tab.Screen name="Attendees"   component={AttendeesScreen}
        initialParams={{ eventId: '', eventName: 'Select an event' }}
      />
      <Tab.Screen name="Connections" component={ConnectionsScreen} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const [initialRoute, setInitialRoute] = useState<'Onboarding' | 'Main' | null>(null);

  useEffect(() => {
    const profile = getProfile();
    setInitialRoute(profile ? 'Main' : 'Onboarding');
  }, []);

  if (!initialRoute) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
        <Stack.Screen name="Onboarding">
          {({ navigation }) => (
            <OnboardingScreen onComplete={() => navigation.replace('Main')} />
          )}
        </Stack.Screen>
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex:            1,
    backgroundColor: colors.bg,
    alignItems:      'center',
    justifyContent:  'center',
  },
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor:  colors.border,
    borderTopWidth:  1,
    height:          60,
    paddingBottom:   8,
  },
  tabLabel: {
    fontSize:   11,
    fontWeight: '600',
  },
});
