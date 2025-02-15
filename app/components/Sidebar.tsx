import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, fontSize, spacing } from '../constants/Colors';
import { Conversation } from '../types/chat';

interface SidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onClose,
}) => {
  const handleDeleteConversation = (id: string) => {
    if (window && window.confirm) {
      const confirmed = window.confirm(
        'Are you sure you want to delete this conversation?'
      );
      if (confirmed) {
        onDeleteConversation(id);
      }
      return;
    }
    Alert.alert(
      'Delete Conversation',
      'Are you sure you want to delete this conversation?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => onDeleteConversation(id),
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <Ionicons name='close' size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.title}>IslamQA AI</Text>
      </View>

      <Pressable style={styles.newChatButton} onPress={onNewConversation}>
        <Ionicons name='add-circle-outline' size={20} color={Colors.text} />
        <Text style={styles.newChatText}>New conversation</Text>
      </Pressable>

      <ScrollView style={styles.conversationList}>
        {conversations.map((conversation) => (
          <Pressable
            key={conversation.id}
            style={[
              styles.conversationItem,
              conversation.id === currentConversationId &&
                styles.activeConversation,
            ]}
            onPress={() => onSelectConversation(conversation.id)}
          >
            <View style={styles.conversationContent}>
              <Ionicons
                name='chatbubble-outline'
                size={16}
                color={Colors.text}
              />
              <Text style={styles.conversationTitle} numberOfLines={1}>
                {conversation.title || 'New Conversation'}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '85%',
    maxWidth: 400,
    backgroundColor: Colors.secondaryBackground,
    height: '100%',
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
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
    marginLeft: spacing.md,
  },
  newChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: spacing.sm,
    margin: spacing.md,
  },
  newChatText: {
    marginLeft: spacing.sm,
    fontSize: fontSize.medium,
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
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  activeConversation: {
    backgroundColor: Colors.background,
  },
  conversationTitle: {
    marginLeft: spacing.sm,
    fontSize: fontSize.regular,
    color: Colors.text,
    flex: 1,
  },
  deleteButton: {
    padding: spacing.sm,
    marginLeft: spacing.sm,
  },
});
