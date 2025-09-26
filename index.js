import { registerRootComponent } from 'expo';


import Chatbot from './ChatBot';
// import App from './App';
// import ChatBotUI from './ChatBotUI';
// import ChatbotScreen from './ChatBotScreen';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(Chatbot);
