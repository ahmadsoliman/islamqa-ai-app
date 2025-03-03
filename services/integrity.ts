import PlayIntegrity from 'react-native-google-play-integrity';

export const preparePlayIntegrity = async (
  googleCloudProjectNumber: `${number}`
) => {
  try {
    const isAvailable = await PlayIntegrity.isPlayIntegrityAvailable();
    console.debug('Play Integrity availablity:', isAvailable);

    // Prepare provider i.e. on application startup
    await PlayIntegrity.prepareStandardIntegrityTokenProvider(
      googleCloudProjectNumber
    );
  } catch (e: any) {
    // e.code 	- IntegrityErrorCode, see https://developer.android.com/google/play/integrity/reference/com/google/android/play/core/integrity/model/IntegrityErrorCode.html#summary
    // e.message 	- Error message
    console.error(
      `Error preparing google play Integrity API(${e.code}): ${e.message}`
    );
  }
};

async function generateNonce(API_URL: string) {
  try {
    const response = await fetch(API_URL + '/nonce', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prefix: null,
        length: null,
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.nonce;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

export const getIntegrityToken = async (API_URL: string) => {
  try {
    // Checks if provider is prepared
    // const isPrepared =
    //   await PlayIntegrity.isStandardIntegrityTokenProviderPrepared();

    const requestHash = await generateNonce(API_URL);
    const integrityToken = await PlayIntegrity.requestStandardIntegrityToken(
      requestHash
    );

    return integrityToken;
  } catch (e: any) {
    // e.code 	- IntegrityErrorCode, see https://developer.android.com/google/play/integrity/reference/com/google/android/play/core/integrity/model/IntegrityErrorCode.html#summary
    // e.message 	- Error message
    console.error(
      `Error requesting standard Integrity Token(${e.code}): ${e.message}`
    );
  }
};
