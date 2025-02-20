import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Purchases, { CustomerInfo } from 'react-native-purchases';

const API_KEY = {
  apple: 'appl_xxxxxxxxxxxxxxxxxxxxxxxx',
  google: 'goog_xxxxxxxxxxxxxxxxxxxxxxxx',
};

// TODO: Implement after release
export const usePurchases = () => {
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);

  const updateStatus = (info: CustomerInfo) => {
    setIsPro(info.entitlements.active.pro_member !== undefined);
  };

  // useEffect(() => {
  //   const setup = async () => {
  //     try {
  //       await Purchases.configure({
  //         apiKey: Platform.OS === 'ios' ? API_KEY.apple : API_KEY.google,
  //       });
  //       const customerInfo = await Purchases.getCustomerInfo();
  //       updateStatus(customerInfo);
  //     } catch (error) {
  //       // console.error('Purchases setup error:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   setup();

  //   const listener = Purchases.addCustomerInfoUpdateListener(updateStatus);
  //   // @ts-ignore
  //   return () => listener?.remove();
  // }, []);

  const handlePurchase = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      const availablePackage = offerings.current?.availablePackages[0];
      if (availablePackage) {
        const { customerInfo } = await Purchases.purchasePackage(
          availablePackage
        );
        updateStatus(customerInfo);
      }
    } catch (error: any) {
      if (!error.userCancelled) {
        console.error('Purchase error:', error);
      }
    }
  };

  return { isPro, loading, handlePurchase };
};
