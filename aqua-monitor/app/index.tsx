import { WebView } from "react-native-webview";

export default function Index() {
  return (
    <WebView
      style={{
        flex: 1,
      }}
      source={{ uri: `http://localhost:5173/?v=${Date.now()}` }}
      cacheEnabled={false}
      incognito={true}
      javaScriptEnabled={true}
      domStorageEnabled={true}
    />
  );
}
