import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { Colors, spacing, fontSize } from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import {
  getFlexDirectionStyle,
  getTextInputDirectionStyle,
} from '../utils/styles';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [message, setMessage] = useState('');
  const { i18n, t } = useTranslation();

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <View style={[styles.container, getFlexDirectionStyle(i18n)]}>
      <TextInput
        style={[styles.input, getTextInputDirectionStyle(i18n)]}
        value={message}
        onChangeText={setMessage}
        placeholder={t('promptPlaceholder')}
        placeholderTextColor={Colors.text + '80'}
        multiline
      />
      <Pressable
        disabled={isLoading}
        onPress={handleSend}
        style={[
          styles.sendButton,
          isLoading ? { backgroundColor: Colors.border } : {},
          i18n.dir() === 'rtl' ? styles.flipHorizontally : {},
        ]}
      >
        <Ionicons
          disabled={isLoading}
          name='send'
          size={20}
          color={Colors.secondaryBackground}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.xs,
    // paddingVertical: 0,
    backgroundColor: Colors.background,
    alignItems: 'center',
    columnGap: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.secondaryBackground,
    borderRadius: spacing.xl,
    padding: spacing.sm * 1.5,
    color: Colors.text,
    maxHeight: 200,
    fontSize: fontSize.medium,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    borderRadius: spacing.xl,
    padding: spacing.sm * 1.5,
  },
  flipHorizontally: {
    transform: [{ scaleX: -1 }],
  },
});
