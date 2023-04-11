export {};

declare global {
  interface Window {
    onSpotifyIframeApiReady: any;
    iframeapi: any;
  }
}
