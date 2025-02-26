import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  SafeAreaView,
  TextStyle,
} from 'react-native';
import { Colors, fontSize, spacing } from '../constants/Colors';
import * as Haptics from 'expo-haptics';
import { Message } from '../types/chat';
import { Share } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import Markdown from 'react-native-markdown-display';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import { getTextDirectionStyle } from '../utils/styles';
import { FeedbackPopup } from './FeedbackPopup';
import { reportMessage } from '@/services/api';

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const { t, i18n } = useTranslation();
  const [showFeedback, setShowFeedback] = useState(false);

  const handleLongPress = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const options: {
      text: string;
      onPress?: () => void | Promise<void>;
      style?: 'cancel' | 'default' | 'destructive';
    }[] = [
      {
        text: t('cancel'),
        style: 'cancel',
      },
      isUser
        ? {
            text: t('copy'),
            onPress: handleCopy,
          }
        : {
            text: t('report'),
            onPress: () => setShowFeedback(true),
          },
      {
        text: t('share'),
        onPress: handleShare,
      },
    ];

    Alert.alert(
      t('copyMessageOptions'),
      message?.text?.length > 100
        ? message?.text?.substring(0, 200) + '...'
        : message?.text || '',
      options,
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

  const handleSubmitFeedback = async (feedback: {
    message: string;
    issue: string;
    reasons: string[];
  }) => {
    try {
      await reportMessage(feedback);
      setShowFeedback(false);
      Toast.show({
        type: 'success',
        text1: t('reportSubmitted'),
        visibilityTime: 2000,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('apiErrorMessage'),
        visibilityTime: 2000,
      });
    }
  };

  return (
    <>
      <Pressable onLongPress={handleLongPress}>
        <View
          style={[
            styles.container,
            isUser ? styles.userContainer : styles.botContainer,
          ]}
        >
          <SafeAreaView>
            <Text>
              <Markdown
                style={{
                  text: isUser ? styles.userText : styles.botText,
                  direction: getTextDirectionStyle(i18n),
                }}
              >
                {message.text}
              </Markdown>
            </Text>
          </SafeAreaView>
          {message.timestamp && (
            <Text
              style={[
                styles.timestamp,
                {
                  textAlign: i18n.dir() === 'rtl' ? 'left' : 'right',
                  direction: i18n.dir(),
                },
              ]}
            >
              {message.timestamp.toLocaleTimeString(i18n.language, {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          )}
        </View>
      </Pressable>

      <FeedbackPopup
        visible={showFeedback}
        onClose={() => setShowFeedback(false)}
        message={message.text}
        onSubmit={handleSubmitFeedback}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: '90%',
    padding: spacing.md,
    marginVertical: spacing.sm,
    borderRadius: spacing.md,
  },
  userContainer: {
    backgroundColor: Colors.primary,
    alignSelf: 'flex-end',
    marginLeft: '10%',
  },
  botContainer: {
    backgroundColor: Colors.secondaryBackground,
    alignSelf: 'flex-start',
    marginRight: '10%',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  text: {
    fontSize: fontSize.regular,
  },
  userText: {
    color: Colors.secondaryBackground,
  } as TextStyle,
  botText: {
    color: Colors.text,
  } as TextStyle,
  timestamp: {
    fontSize: fontSize.small,
    color: Colors.text,
    opacity: 0.6,
    marginTop: spacing.xs,
  },
});
