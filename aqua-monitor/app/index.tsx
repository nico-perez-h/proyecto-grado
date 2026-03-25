import { WebView } from "react-native-webview";

export default function Index() {
  return (
    <WebView
      style={{
        flex: 1,
      }}
      source={{ uri: `https://aqua-monitor-4629c.web.app/?v=${Date.now()}` }}
      cacheEnabled={false}
      incognito={true}
      javaScriptEnabled={true}
      domStorageEnabled={true}
    />
  );
}
