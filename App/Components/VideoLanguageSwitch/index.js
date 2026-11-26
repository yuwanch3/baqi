import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { toDp } from '@percentageToDP';
import { COLORS } from '../Theme';

const OPTIONS = [
  { code: 'id', label: 'Indonesia' },
  { code: 'en', label: 'English' },
];

/**
 * Segment control pemilih bahasa video.
 * `available` berisi ketersediaan tiap versi, mis. { id: true, en: false }.
 */
const VideoLanguageSwitch = ({ value, onChange, available = {} }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('common:bahasaVideo')}</Text>
      <View style={styles.track}>
        {OPTIONS.map((option) => {
          const disabled = !available[option.code];
          const active = value === option.code && !disabled;

          return (
            <Pressable
              key={option.code}
              disabled={disabled}
              onPress={() => onChange(option.code)}
              style={[
                styles.option,
                active ? styles.optionActive : null,
                disabled ? styles.optionDisabled : null,
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  active ? styles.optionTextActive : null,
                  disabled ? styles.optionTextDisabled : null,
                ]}
              >
                {option.label}
              </Text>
              {disabled && (
                <Text style={styles.comingSoonText}>{t('common:segeraHadir')}</Text>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: toDp(16),
    marginTop: toDp(8),
  },
  label: {
    color: '#444',
    fontSize: toDp(12),
    marginBottom: toDp(6),
  },
  track: {
    flexDirection: 'row',
    backgroundColor: '#E9ECEF',
    borderRadius: toDp(24),
    padding: toDp(3),
  },
  option: {
    flex: 1,
    minHeight: toDp(44),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: toDp(21),
  },
  optionActive: {
    backgroundColor: COLORS.primary,
  },
  optionDisabled: {
    opacity: 0.5,
  },
  optionText: {
    color: '#333',
    fontSize: toDp(13),
    fontWeight: '500',
  },
  optionTextActive: {
    color: COLORS.white,
    fontWeight: '600',
  },
  optionTextDisabled: {
    color: '#888',
  },
  comingSoonText: {
    color: '#888',
    fontSize: toDp(10),
    marginTop: toDp(1),
  },
});

export default VideoLanguageSwitch;
