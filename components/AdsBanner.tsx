import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

export default function AdsBanner() {
  const unitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-xxxxxxxx/yyyyyyyy';
  return <BannerAd unitId={unitId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />;
}


