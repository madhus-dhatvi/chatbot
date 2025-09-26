import { SafeAreaProvider } from "react-native-safe-area-context";
import ChatbotScreen from "./ChatBotScreen";

export default function App() {
  return (
    <SafeAreaProvider>
      <ChatbotScreen />
    </SafeAreaProvider>
  );
}








