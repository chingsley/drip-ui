import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { usePreferences } from '@/hooks/usePreferences';
import {
  DRESS_STYLES,
  CULTURES,
  DRESS_CODES,
  COMMON_COLORS,
  COMMON_MATERIALS,
} from '@/types/preferences';
import type { UserPreferences } from '@/types/preferences';

export default function SettingsScreen() {
  const { preferences, loading, savePreferences } = usePreferences();
  const [localPreferences, setLocalPreferences] = useState<UserPreferences>(preferences);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await savePreferences(localPreferences);
      router.back();
    } catch (error) {
      console.error('Failed to save preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  const toggleSelection = <K extends keyof UserPreferences>(
    key: K,
    value: string
  ) => {
    setLocalPreferences(prev => {
      if (key === 'preferredColors' || key === 'materials') {
        const currentArray = (prev[key] || []) as string[];
        const newArray = currentArray.includes(value)
          ? currentArray.filter(v => v !== value)
          : [...currentArray, value];
        return { ...prev, [key]: newArray };
      } else {
        return { ...prev, [key]: prev[key] === value ? undefined : value };
      }
    });
  };

  const isSelected = <K extends keyof UserPreferences>(
    key: K,
    value: string
  ): boolean => {
    const currentValue = localPreferences[key];
    if (Array.isArray(currentValue)) {
      return currentValue.includes(value);
    }
    return currentValue === value;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.PRIMARY} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.BLACK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Preferences</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving}>
          {saving ? (
            <ActivityIndicator size="small" color={colors.PRIMARY} />
          ) : (
            <Text style={styles.saveText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Dress Style */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dress Style</Text>
          <Text style={styles.sectionDescription}>
            Select your preferred dress style
          </Text>
          <View style={styles.optionsGrid}>
            {DRESS_STYLES.map(option => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  isSelected('dressStyle', option.value) && styles.optionButtonSelected,
                ]}
                onPress={() => toggleSelection('dressStyle', option.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected('dressStyle', option.value) && styles.optionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Culture */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cultural Style</Text>
          <Text style={styles.sectionDescription}>
            Choose your preferred cultural clothing style
          </Text>
          <View style={styles.optionsGrid}>
            {CULTURES.map(option => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  isSelected('culture', option.value) && styles.optionButtonSelected,
                ]}
                onPress={() => toggleSelection('culture', option.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected('culture', option.value) && styles.optionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Dress Code */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dress Code</Text>
          <Text style={styles.sectionDescription}>
            Select your typical dress code
          </Text>
          <View style={styles.optionsGrid}>
            {DRESS_CODES.map(option => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  isSelected('dressCode', option.value) && styles.optionButtonSelected,
                ]}
                onPress={() => toggleSelection('dressCode', option.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected('dressCode', option.value) && styles.optionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Preferred Colors */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferred Colors</Text>
          <Text style={styles.sectionDescription}>
            Select your favorite colors (multiple allowed)
          </Text>
          <View style={styles.optionsGrid}>
            {COMMON_COLORS.map(option => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  isSelected('preferredColors', option.value) && styles.optionButtonSelected,
                ]}
                onPress={() => toggleSelection('preferredColors', option.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected('preferredColors', option.value) && styles.optionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Materials */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferred Materials</Text>
          <Text style={styles.sectionDescription}>
            Choose your preferred clothing materials (multiple allowed)
          </Text>
          <View style={styles.optionsGrid}>
            {COMMON_MATERIALS.map(option => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  isSelected('materials', option.value) && styles.optionButtonSelected,
                ]}
                onPress={() => toggleSelection('materials', option.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected('materials', option.value) && styles.optionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Info Note */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color={colors.PRIMARY} />
          <Text style={styles.infoText}>
            These preferences will be used to personalize your outfit suggestions.
            You can change them anytime.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: colors.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.BLACK,
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.PRIMARY,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.BLACK,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.WHITE,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  optionButtonSelected: {
    backgroundColor: colors.PRIMARY,
    borderColor: colors.PRIMARY,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.BLACK,
  },
  optionTextSelected: {
    color: colors.WHITE,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginTop: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1976D2',
    lineHeight: 20,
  },
});


