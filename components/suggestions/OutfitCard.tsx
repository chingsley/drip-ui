import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { OutfitSuggestion } from '@/types/clothing';
import { colors } from '@/constants/colors';

interface OutfitCardProps {
  outfit: OutfitSuggestion;
  onFavoriteToggle?: (outfitId: string) => void;
  onBuyPress?: (buyLink: string) => void;
}

export const OutfitCard: React.FC<OutfitCardProps> = ({
  outfit,
  onFavoriteToggle,
  onBuyPress,
}) => {
  const handleBuyPress = (link?: string) => {
    if (link) {
      if (onBuyPress) {
        onBuyPress(link);
      } else {
        Linking.openURL(link);
      }
    }
  };

  return (
    <View style={styles.card}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with favorite button */}
        <View style={styles.header}>
          <Text style={styles.title}>Suggested Outfit</Text>
          <TouchableOpacity
            onPress={() => onFavoriteToggle?.(outfit.id)}
            style={styles.favoriteButton}
          >
            <Ionicons
              name={outfit.isFavorite ? 'heart' : 'heart-outline'}
              size={28}
              color={outfit.isFavorite ? '#FF6B6B' : colors.BLACK}
            />
          </TouchableOpacity>
        </View>

        {/* Temperature Range Info */}
        <View style={styles.tempInfo}>
          <Ionicons name="thermometer-outline" size={20} color={colors.PRIMARY} />
          <Text style={styles.tempText}>
            Suitable for {outfit.totalTemperatureRange.min}°C - {outfit.totalTemperatureRange.max}°C
          </Text>
        </View>

        {/* Clothing Items */}
        <View style={styles.itemsContainer}>
          {outfit.items.map((item, index) => (
            <View key={item.id} style={styles.itemCard}>
              {/* Item Image */}
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.itemImage}
                  contentFit="cover"
                  transition={200}
                />
                <View style={styles.typeTag}>
                  <Text style={styles.typeTagText}>{item.type.toUpperCase()}</Text>
                </View>
              </View>

              {/* Item Details */}
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <View style={styles.itemMeta}>
                  <View style={styles.metaRow}>
                    <Ionicons name="color-palette-outline" size={16} color={colors.PRIMARY} />
                    <Text style={styles.metaText}>{item.color}</Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Ionicons name="shirt-outline" size={16} color={colors.PRIMARY} />
                    <Text style={styles.metaText}>{item.material}</Text>
                  </View>
                </View>
                <View style={styles.itemMeta}>
                  <View style={styles.metaRow}>
                    <Ionicons name="globe-outline" size={16} color={colors.PRIMARY} />
                    <Text style={styles.metaText}>{item.culture}</Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Ionicons name="person-outline" size={16} color={colors.PRIMARY} />
                    <Text style={styles.metaText}>{item.style}</Text>
                  </View>
                </View>

                {/* Buy Button */}
                {item.buyLink && (
                  <TouchableOpacity
                    style={styles.buyButton}
                    onPress={() => handleBuyPress(item.buyLink)}
                  >
                    <Ionicons name="cart-outline" size={18} color={colors.WHITE} />
                    <Text style={styles.buyButtonText}>Buy This Item</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Buy Complete Outfit Button */}
        <TouchableOpacity style={styles.buyOutfitButton}>
          <Ionicons name="bag-handle-outline" size={20} color={colors.WHITE} />
          <Text style={styles.buyOutfitText}>Buy Complete Outfit</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.WHITE,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.BLACK,
  },
  favoriteButton: {
    padding: 8,
  },
  tempInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  tempText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.BLACK,
    fontWeight: '500',
  },
  itemsContainer: {
    gap: 16,
  },
  itemCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  typeTag: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: colors.PRIMARY,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  typeTagText: {
    color: colors.WHITE,
    fontSize: 12,
    fontWeight: '600',
  },
  itemDetails: {
    padding: 16,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.BLACK,
    marginBottom: 8,
  },
  itemMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: '#666',
    textTransform: 'capitalize',
  },
  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  buyButtonText: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '600',
  },
  buyOutfitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2ECC71',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 20,
    gap: 8,
  },
  buyOutfitText: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '700',
  },
});

