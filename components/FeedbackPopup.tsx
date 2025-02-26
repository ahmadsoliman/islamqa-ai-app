import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { Colors, fontSize, spacing } from '../constants/Colors';
import { useTranslation } from 'react-i18next';
import Checkbox from 'expo-checkbox';

interface FeedbackPopupProps {
  visible: boolean;
  onClose: () => void;
  message: string;
  onSubmit: (feedback: {
    message: string;
    issue: string;
    reasons: string[];
  }) => void;
}

export const FeedbackPopup: React.FC<FeedbackPopupProps> = ({
  visible,
  onClose,
  message,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);

  const handleSubmit = () => {
    if (!feedbackText && selectedReasons.length === 0) {
      Alert.alert(t('provideFeedback'), t('feedbackPlaceholder'));
      return;
    }

    onSubmit({
      message,
      issue: feedbackText,
      reasons: selectedReasons,
    });
    setFeedbackText('');
    setSelectedReasons([]);
    onClose();
  };

  const toggleReason = (reason: string) => {
    setSelectedReasons((prev) =>
      prev.includes(reason)
        ? prev.filter((r) => r !== reason)
        : [...prev, reason]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType='slide'
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{t('provideFeedback')}</Text>
          <Text style={styles.message}>
            {message.substring(0, 200) + (message.length > 200 ? '...' : '')}
          </Text>

          <TextInput
            style={styles.input}
            multiline
            placeholder={t('feedbackPlaceholder')}
            value={feedbackText}
            onChangeText={setFeedbackText}
          />

          <View style={styles.checkboxContainer}>
            <Checkbox
              value={selectedReasons.includes('harmful')}
              onValueChange={() => toggleReason('harmful')}
              color={Colors.primary}
            />
            <Text style={styles.checkboxLabel}>{t('harmfulContent')}</Text>
          </View>

          <View style={styles.checkboxContainer}>
            <Checkbox
              value={selectedReasons.includes('incorrect')}
              onValueChange={() => toggleReason('incorrect')}
              color={Colors.primary}
            />
            <Text style={styles.checkboxLabel}>{t('incorrectContent')}</Text>
          </View>

          <View style={styles.checkboxContainer}>
            <Checkbox
              value={selectedReasons.includes('unhelpful')}
              onValueChange={() => toggleReason('unhelpful')}
              color={Colors.primary}
            />
            <Text style={styles.checkboxLabel}>{t('unhelpfulContent')}</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>{t('cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>{t('submit')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    width: '90%',
    backgroundColor: Colors.secondaryBackground,
    padding: spacing.md,
    borderRadius: spacing.md,
  },
  title: {
    fontSize: fontSize.large,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    color: Colors.text,
  },
  message: {
    fontSize: fontSize.regular,
    color: Colors.text,
    marginBottom: spacing.md,
  },
  input: {
    minHeight: 100,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: spacing.sm,
    padding: spacing.sm,
    marginBottom: spacing.md,
    textAlignVertical: 'top',
    color: Colors.text,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  checkboxLabel: {
    marginLeft: spacing.sm,
    fontSize: fontSize.regular,
    color: Colors.text,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  button: {
    flex: 1,
    padding: spacing.sm,
    borderRadius: spacing.sm,
    alignItems: 'center',
    marginHorizontal: spacing.xs,
  },
  cancelButton: {
    backgroundColor: Colors.primary,
  },
  submitButton: {
    backgroundColor: Colors.error,
  },
  buttonText: {
    color: Colors.secondaryBackground,
    fontSize: fontSize.regular,
  },
});
