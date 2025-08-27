import { Stack } from "expo-router";
import { useFonts } from "expo-font";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'CAIXAStd-Regular': require('../assets/fonts/CAIXAStd-Regular.ttf'),
    'CAIXAStd-Bold': require('../assets/fonts/CAIXAStd-Bold.ttf'),
    'CAIXAStd-BoldItalic': require('../assets/fonts/CAIXAStd-BoldItalic.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
