import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Purchases, {
  CustomerInfo,
  LOG_LEVEL,
  PurchasesPackage,
} from 'react-native-purchases';

const API_KEY = {
  apple: 'appl_xxxxxxxxxxxxxxxxxxxxxxxx',
  google: 'goog_yhjYyWFbzGvqaAuKpUApbtLyoNP',
};

// TODO: Implement after release
export const usePurchases = () => {
  const [hasRemovedAds, setHasRemovedAds] = useState(false);
  const [loading, setLoading] = useState(true);
  const [removeAdsPackage, setRemoveAdsPackage] = useState<
    PurchasesPackage | undefined
  >(undefined);

  const updateStatus = (info: CustomerInfo) => {
    setHasRemovedAds(info.entitlements.active['No Ads'] !== undefined);
  };

  useEffect(() => {
    const setup = async () => {
      try {
        if (__DEV__) {
          Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
        }

        await Purchases.configure({
          apiKey: Platform.OS === 'ios' ? API_KEY.apple : API_KEY.google,
        });

        const customerInfo = await Purchases.getCustomerInfo();
        updateStatus(customerInfo);

        const offerings = await Purchases.getOfferings();
        const availablePackages = offerings.current?.availablePackages;
        if (availablePackages && availablePackages?.length > 0) {
          setRemoveAdsPackage(
            availablePackages.find((p) => p.product.identifier === 'remove_ads')
          );
        }
      } catch (error) {
        console.error('Purchases setup error:', error);
      } finally {
        setLoading(false);
      }
    };

    setup();

    const listener = Purchases.addCustomerInfoUpdateListener(updateStatus);
    // @ts-ignore
    return () => listener?.remove();
  }, []);

  const purchaseRemoveAds = async () => {
    try {
      setLoading(true);

      if (removeAdsPackage) {
        const { customerInfo } = await Purchases.purchasePackage(
          removeAdsPackage
        );
        updateStatus(customerInfo);
      }
    } catch (error: any) {
      if (!error.userCancelled) {
        console.error('Purchase error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  return { hasRemovedAds, loading, purchaseRemoveAds, removeAdsPackage };
};
