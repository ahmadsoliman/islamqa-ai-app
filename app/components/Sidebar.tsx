import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, fontSize, spacing } from '../constants/Colors';
import { Conversation } from '../types/chat';
import { AnimatedView } from './AnimatedView';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';
import { getTextDirectionStyle } from '../utils/styles';

interface SidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onClose: () => void;
  onLanguageChange: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onClose,
  onLanguageChange,
}) => {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter((conversation) =>
    conversation.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteConversation = (id: string) => {
    if (window && window.confirm) {
      if (window.confirm(t('deleteConfirm'))) {
        onDeleteConversation(id);
      }
      return;
    }
    Alert.alert(t('deleteConversation'), t('deleteConfirm'), [
      {
        text: t('cancel'),
        style: 'cancel',
      },
      {
        text: t('delete'),
        onPress: () => onDeleteConversation(id),
        style: 'destructive',
      },
    ]);
  };

  return (
    <AnimatedView
      style={[
        styles.container,
        { right: i18n.dir() === 'rtl' ? 0 : undefined },
      ]}
    >
      <View
        style={[
          styles.header,
          { flexDirection: i18n.dir() === 'rtl' ? 'row-reverse' : 'row' },
        ]}
      >
        <Pressable onPress={onClose} style={styles.closeButton}>
          <Ionicons name='close' size={24} color={Colors.text} />
        </Pressable>
        <Text style={[styles.title, getTextDirectionStyle(i18n)]}>
          {t('islamqaAI')}
        </Text>
      </View>

      <Pressable
        style={[
          styles.newChatButton,
          { flexDirection: i18n.dir() === 'rtl' ? 'row-reverse' : 'row' },
        ]}
        onPress={onNewConversation}
      >
        <Ionicons name='add-circle-outline' size={20} color={Colors.text} />
        <Text style={[styles.newChatText, getTextDirectionStyle(i18n)]}>
          {t('newConversation')}
        </Text>
      </Pressable>

      <TextInput
        style={[styles.searchInput, getTextDirectionStyle(i18n)]}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder={t('searchConversations')}
        placeholderTextColor={Colors.text + '80'}
      />

      <ScrollView style={styles.conversationList}>
        {filteredConversations.map((conversation) => (
          <Pressable
            key={conversation.id}
            style={[
              styles.conversationItem,
              conversation.id === currentConversationId &&
                styles.activeConversation,
              {
                flexDirection: i18n.dir() === 'rtl' ? 'row-reverse' : 'row',
              },
            ]}
            onPress={() => onSelectConversation(conversation.id)}
          >
            <View
              style={[
                styles.conversationContent,
                {
                  flexDirection: i18n.dir() === 'rtl' ? 'row-reverse' : 'row',
                },
              ]}
            >
              <Ionicons
                name='chatbubble-outline'
                size={16}
                color={Colors.text}
              />
              <Text
                style={[styles.conversationTitle, getTextDirectionStyle(i18n)]}
                numberOfLines={1}
              >
                {conversation.title || t('newConversation')}
              </Text>
            </View>
            {conversation.id !== currentConversationId && (
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  handleDeleteConversation(conversation.id);
                }}
                style={styles.deleteButton}
              >
                <Ionicons name='trash-outline' size={16} color={Colors.text} />
              </Pressable>
            )}
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <LanguageSwitcher onLanguageChange={onLanguageChange} />
      </View>
    </AnimatedView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondaryBackground,
    height: '100%',
    borderRightWidth: 1,
    borderRightColor: Colors.border,
    position: 'absolute',
    width: '100%',
    zIndex: 1,
  },
  header: {
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeButton: {
    padding: spacing.sm,
  },
  title: {
    fontSize: fontSize.large,
    fontWeight: 'bold',
    color: Colors.text,
    marginHorizontal: spacing.md,
  },
  newChatButton: {
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: spacing.sm,
    margin: spacing.md,
  },
  newChatText: {
    marginHorizontal: spacing.sm,
    fontSize: fontSize.medium,
    color: Colors.text,
  },
  searchInput: {
    backgroundColor: Colors.background,
    borderRadius: spacing.sm,
    padding: spacing.sm,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    color: Colors.text,
  },
  conversationList: {
    flex: 1,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    justifyContent: 'space-between',
  },
  conversationContent: {
    alignItems: 'center',
    flex: 1,
  },
  activeConversation: {
    backgroundColor: Colors.background,
  },
  conversationTitle: {
    marginHorizontal: spacing.sm,
    fontSize: fontSize.regular,
    color: Colors.text,
    flex: 1,
  },
  deleteButton: {
    padding: spacing.sm,
    marginHorizontal: spacing.sm,
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    alignItems: 'center',
  },
});
