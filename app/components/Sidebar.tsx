import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, fontSize, spacing } from '../constants/Colors';
import { Conversation } from '../types/chat';

interface SidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onClose,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.title}>IslamQA AI</Text>
      </View>
      
      <Pressable 
        style={styles.newChatButton}
        onPress={onNewConversation}
      >
        <Ionicons name="add-circle-outline" size={20} color={Colors.text} />
        <Text style={styles.newChatText}>New conversation</Text>
      </Pressable>

      <ScrollView style={styles.conversationList}>
        {conversations.map((conversation) => (
          <Pressable
            key={conversation.id}
            style={[
              styles.conversationItem,
              conversation.id === currentConversationId && styles.activeConversation,
            ]}
            onPress={() => onSelectConversation(conversation.id)}
          >
            <Ionicons name="chatbubble-outline" size={16} color={Colors.text} />
            <Text style={styles.conversationTitle} numberOfLines={1}>
              {conversation.title || 'New Conversation'}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '80%',
    maxWidth: 300,
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
});
