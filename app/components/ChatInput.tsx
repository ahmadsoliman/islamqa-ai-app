import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { Colors, spacing } from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

interface ChatInputProps {
  onSend: (message: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const [message, setMessage] = useState('');
  const { t } = useTranslation();

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder={t('promptPlaceholder')}
        placeholderTextColor={Colors.text + '80'}
        multiline
      />
      <Pressable onPress={handleSend} style={styles.sendButton}>
        <Ionicons name='send' size={24} color={Colors.primary} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: Colors.secondaryBackground,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: spacing.md,
    padding: spacing.sm,
    marginRight: spacing.sm,
    color: Colors.text,
    maxHeight: 100,
  },
  sendButton: {
    padding: spacing.sm,
  },
});
