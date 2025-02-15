import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Animated } from 'react-native';
import { ChatBubble } from './components/ChatBubble';
import { ChatInput } from './components/ChatInput';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Colors } from './constants/Colors';
import { Message, Conversation } from './types/chat';
import { sendMessage } from './services/api';
import { saveConversations, loadConversations } from './utils/storage';
import { StatusBar } from 'expo-status-bar';

export default function ChatScreen() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const slideAnim = useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    loadConversations().then((loaded) => {
      setConversations(loaded);
      if (loaded.length > 0) {
        setCurrentConversationId(loaded[0].id);
      } else {
        createNewConversation();
      }
    });
  }, []);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isSidebarOpen ? 0 : -300,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isSidebarOpen]);

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'New Conversation',
      messages: [],
      lastUpdated: new Date(),
    };
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
    setIsSidebarOpen(false);
    saveConversations([newConversation, ...conversations]);
  };

  const getCurrentConversation = () => {
    return conversations.find(c => c.id === currentConversationId);
  };

  const updateConversationTitle = (messages: Message[]) => {
    if (messages.length === 2) { // After first exchange
      const userMessage = messages[0].text;
      const title = userMessage.slice(0, 30) + (userMessage.length > 30 ? '...' : '');
      setConversations(prev =>
        prev.map(conv =>
          conv.id === currentConversationId
            ? { ...conv, title }
            : conv
        )
      );
    }
  };

  const handleSend = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    const updatedMessages = [...(getCurrentConversation()?.messages || []), userMessage];
    
    setConversations(prev =>
      prev.map(conv =>
        conv.id === currentConversationId
          ? {
              ...conv,
              messages: updatedMessages,
              lastUpdated: new Date(),
            }
          : conv
      )
    );

    setIsLoading(true);

    try {
      const response = await sendMessage(text);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.message || 'Sorry, I could not process your request.',
        sender: 'bot',
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, botMessage];
      
      setConversations(prev =>
        prev.map(conv =>
          conv.id === currentConversationId
            ? {
                ...conv,
                messages: finalMessages,
                lastUpdated: new Date(),
              }
            : conv
        )
      );

      updateConversationTitle(finalMessages);
      await saveConversations(conversations);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, something went wrong. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setConversations(prev =>
        prev.map(conv =>
          conv.id === currentConversationId
            ? {
                ...conv,
                messages: [...updatedMessages, errorMessage],
                lastUpdated: new Date(),
              }
            : conv
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const currentConversation = getCurrentConversation();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header
        onMenuPress={() => setIsSidebarOpen(true)}
        title={currentConversation?.title || 'New Conversation'}
      />
      
      <Animated.View style={[
        styles.sidebar,
        {
          transform: [{ translateX: slideAnim }],
        },
      ]}>
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
        keyExtractor={item => item.id}
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
