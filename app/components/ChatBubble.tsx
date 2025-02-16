import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { Colors, fontSize, spacing } from '../constants/Colors';
import * as Haptics from 'expo-haptics';
import { Message } from '../types/chat';
import { Share } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const { t } = useTranslation();

  const handleLongPress = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      t('copyMessageOptions'),
      message?.text?.length > 100
        ? message?.text?.substring(0, 200) + '...'
        : message?.text || '',
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('copy'),
          onPress: handleCopy,
        },
        {
          text: t('share'),
          onPress: handleShare,
        },
      ],
      { cancelable: true }
    );
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(message.text);
    Toast.show({
      type: 'success',
      text1: t('copied'),
      visibilityTime: 2000,
    });
  };

  const handleShare = async () => {
    await Share.share({
      message: message.text,
    });
  };

  return (
    <Pressable onLongPress={handleLongPress}>
      <View
        style={[
          styles.container,
          isUser ? styles.userContainer : styles.botContainer,
        ]}
      >
        <Text style={[styles.text, isUser ? styles.userText : styles.botText]}>
          {message.text}
        </Text>
        <Text style={styles.timestamp}>
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    padding: spacing.md,
    marginVertical: spacing.sm,
    borderRadius: spacing.md,
  },
  userContainer: {
    backgroundColor: Colors.primary,
    alignSelf: 'flex-end',
    marginLeft: '20%',
  },
  botContainer: {
    backgroundColor: Colors.secondaryBackground,
    alignSelf: 'flex-start',
    marginRight: '20%',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  text: {
    fontSize: fontSize.regular,
  },
  userText: {
    color: Colors.secondaryBackground,
  },
  botText: {
    color: Colors.text,
  },
  timestamp: {
    fontSize: fontSize.small,
    color: Colors.text,
    opacity: 0.6,
    marginTop: spacing.xs,
    textAlign: 'right',
  },
});
