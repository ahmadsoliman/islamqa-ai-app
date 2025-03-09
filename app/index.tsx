import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Animated,
  Pressable,
  Dimensions,
  Platform,
  Keyboard,
} from 'react-native';
import { ChatBubble } from '../components/ChatBubble';
import { ChatInput } from '../components/ChatInput';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Colors } from '../constants/Colors';
import { Message, Conversation } from '../types/chat';
import { sendMessage } from '../services/api';
import {
  saveConversations,
  loadConversations,
  getUserId,
} from '../utils/storage';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { AdInterstitial } from '@/components/AdInterstitial';
import { usePurchases } from '@/services/purchases';
import LoadingComponent from '@/components/LoadingComponent';

const SIDEBAR_WIDTH = 350;
const PROMPT_COUNT_TO_AD = 2;

export default function Index() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  const [promptCount, setPromptCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const flatListRef = useRef<FlatList>(null);
  const { t, i18n } = useTranslation();
  const { hasRemovedAds } = usePurchases();

  const slideAnim = useRef(
    new Animated.Value(
      i18n.dir() === 'rtl' ? Dimensions.get('window').width : -SIDEBAR_WIDTH
    )
  ).current;

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

  const placeSideBar = () => {
    Animated.timing(slideAnim, {
      toValue: isSidebarOpen
        ? i18n.dir() === 'rtl' && Platform.OS === 'web'
          ? Dimensions.get('window').width - SIDEBAR_WIDTH
          : 0
        : i18n.dir() === 'rtl'
        ? Dimensions.get('window').width
        : -SIDEBAR_WIDTH,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    placeSideBar();
  }, [isSidebarOpen]);

  const createNewConversation = () => {
    setIsSidebarOpen(false);
    setConversations((prevConvs) => {
      if (prevConvs.length > 0 && !prevConvs[0].isTouched) {
        setCurrentConversationId(prevConvs[0].id);
        return prevConvs;
      }
      const newConversation: Conversation = {
        id: Math.random().toString(36).substring(2) + Date.now().toString(36),
        title: null,
        messages: [],
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

  const deleteConversation = async (id: string) => {
    const updatedConversations = conversations.filter((conv) => conv.id !== id);
    setConversations(updatedConversations);
    await saveConversations(updatedConversations);

    if (id === currentConversationId) {
      if (updatedConversations.length > 0) {
        setCurrentConversationId(updatedConversations[0].id);
      } else {
        createNewConversation();
      }
    }
  };

  const handleSend = async (text: string) => {
    if (!currentConversationId || !userId || isLoading) return;

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

    Keyboard.dismiss();
    flatListRef.current?.scrollToEnd();

    setPromptCount((prev) => prev + 1);

    try {
      const response = await sendMessage(
        text,
        currentConversationId,
        userId,
        getCurrentConversation()?.messages
      );
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.message || t('apiErrorMessage'),
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
        text: t('apiErrorMessage'),
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
      flatListRef.current?.scrollToEnd();
    }
  };

  const currentConversation = getCurrentConversation();

  return (
    <View style={styles.container}>
      {/* Show Interstitial Ad every n prompts */}
      {!hasRemovedAds && (
        <AdInterstitial
          showAd={promptCount > 0 && promptCount % PROMPT_COUNT_TO_AD === 0}
        />
      )}

      <StatusBar style='dark' />
      <View style={styles.content}>
        <Header
          onMenuPress={() => setIsSidebarOpen(true)}
          title={currentConversation?.title || t('newConversation')}
        />

        {isSidebarOpen && (
          <Pressable
            style={styles.overlay}
            onPress={() => setIsSidebarOpen(false)}
          />
        )}

        <FlatList
          ref={flatListRef}
          data={
            currentConversation?.messages.length
              ? currentConversation?.messages
              : [
                  {
                    id: '0',
                    sender: 'bot',
                    text: t('initialMessage'),
                  } as Message,
                ]
          }
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChatBubble message={item} />}
          contentContainerStyle={styles.chatContainer}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        />

        {isLoading && <LoadingComponent />}

        <ChatInput onSend={handleSend} isLoading={isLoading} />
      </View>

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
          onDeleteConversation={deleteConversation}
          onClose={() => setIsSidebarOpen(false)}
          onLanguageChange={() =>
            setTimeout(() => setIsSidebarOpen(false), 100)
          }
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    marginTop: 0,
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
    width: '85%',
    maxWidth: SIDEBAR_WIDTH,
    height: '100%',
  },
  chatContainer: {
    padding: 16,
    paddingBottom: 32,
  },
});
