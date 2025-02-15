import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Animated,
  Pressable,
} from 'react-native';
import { ChatBubble } from './components/ChatBubble';
import { ChatInput } from './components/ChatInput';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Colors } from './constants/Colors';
import { Message, Conversation, createInitialMessage } from './types/chat';
import { sendMessage } from './services/api';
import {
  saveConversations,
  loadConversations,
  getUserId,
} from './utils/storage';
import { StatusBar } from 'expo-status-bar';

export default function ChatScreen() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const flatListRef = useRef<FlatList>(null);
  const slideAnim = useRef(new Animated.Value(-400)).current;

  useEffect(() => {
    const init = async () => {
      const [loadedConversations, loadedUserId] = await Promise.all([
        loadConversations(),
        getUserId(),
      ]);
      setUserId(loadedUserId);
      setConversations(loadedConversations);
      createNewConversation();
    };
    init();
  }, []);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isSidebarOpen ? 0 : -400,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isSidebarOpen]);

  const createNewConversation = () => {
    setConversations((prevConvs) => {
      setIsSidebarOpen(false);

      if (prevConvs.length > 0 && !prevConvs[0].isTouched) {
        setCurrentConversationId(prevConvs[0].id);
        return prevConvs;
      }
      const newConversation: Conversation = {
        id: Math.random().toString(36).substring(2) + Date.now().toString(36),
        title: 'New Conversation',
        messages: [createInitialMessage()],
        lastUpdated: new Date(),
        isTouched: false,
      };
      saveConversations([newConversation, ...prevConvs]);
      setCurrentConversationId(newConversation.id);
      return [newConversation, ...prevConvs];
    });
  };

  const getCurrentConversation = () => {
    return conversations.find((c) => c.id === currentConversationId);
  };

  const handleSend = async (text: string) => {
    if (!currentConversationId || !userId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    const conversationTitle =
      text.slice(0, 30) + (text.length > 30 ? '...' : '');

    const updatedMessages = [
      ...(getCurrentConversation()?.messages || []),
      userMessage,
    ];

    const updatedConversations = conversations.map((conv) =>
      conv.id === currentConversationId
        ? {
            ...conv,
            title: updatedMessages.length < 3 ? conversationTitle : conv.title,
            messages: updatedMessages,
            isTouched: true,
            lastUpdated: new Date(),
          }
        : conv
    );
    setConversations(updatedConversations);
    await saveConversations(updatedConversations);

    setIsLoading(true);

    try {
      const response = await sendMessage(text, currentConversationId, userId);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.message || 'Sorry, I could not process your request.',
        sender: 'bot',
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, botMessage];

      const finalConversations = updatedConversations.map((conv) =>
        conv.id === currentConversationId
          ? {
              ...conv,
              messages: finalMessages,
              isTouched: true,
              lastUpdated: new Date(),
            }
          : conv
      );

      setConversations(finalConversations);
      await saveConversations(finalConversations);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, something went wrong. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
      };

      const errorConversations = conversations.map((conv) =>
        conv.id === currentConversationId
          ? {
              ...conv,
              messages: [...updatedMessages, errorMessage],
              isTouched: true,
              lastUpdated: new Date(),
            }
          : conv
      );

      setConversations(errorConversations);
      await saveConversations(errorConversations);
    } finally {
      setIsLoading(false);
    }
  };

  const currentConversation = getCurrentConversation();

  return (
    <View style={styles.container}>
      <StatusBar style='dark' />
      <Header
        onMenuPress={() => setIsSidebarOpen(true)}
        title={currentConversation?.title || 'New Conversation'}
      />

      {isSidebarOpen && (
        <Pressable
          style={styles.overlay}
          onPress={() => setIsSidebarOpen(false)}
        />
      )}

      <Animated.View
        style={[
          styles.sidebar,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <Sidebar
          conversations={conversations}
          currentConversationId={currentConversationId}
          onSelectConversation={(id) => {
            setCurrentConversationId(id);
            setIsSidebarOpen(false);
          }}
          onNewConversation={createNewConversation}
          onClose={() => setIsSidebarOpen(false)}
        />
      </Animated.View>

      <FlatList
        ref={flatListRef}
        data={currentConversation?.messages || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatBubble message={item} />}
        contentContainerStyle={styles.chatContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      )}

      <ChatInput onSend={handleSend} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 50,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 100,
  },
  chatContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },
});
