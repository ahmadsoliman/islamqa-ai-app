import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, fontSize, spacing } from '../constants/Colors';
import * as Haptics from 'expo-haptics';
import { Message } from '../types/chat';
import { Share } from 'react-native';

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  const handleLongPress = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
