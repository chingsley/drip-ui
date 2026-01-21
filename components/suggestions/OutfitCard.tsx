import { Image, StyleSheet, View, ImageSourcePropType } from 'react-native';
import React from 'react';
import { colors } from '@/constants/colors';
import { drawBorder } from '@/utils';


interface OutfitCardProp {
  isActive: boolean;
  imageUrls: ImageSourcePropType[];
}
const OutfitCard = ({ isActive, imageUrls }: OutfitCardProp) => {
  return (
    <View style={styles.outfitCard}>
      {imageUrls.map((imageUrl, index) => {
        const isLastItem = (index === 2 && imageUrls.length === 3) ||
          (index === 1 && imageUrls.length === 2);
        const flexValueForLastItem = imageUrls.length === 3 ? 0.5 : 0.3;
        return (
          <View key={index} style={[styles.outfitItem, isLastItem && { flex: flexValueForLastItem }]}>
            <Image
              source={imageUrl}
              style={styles.outfitItemImg}
            />
          </View>
        );
      })}
    </View>
  );
};

export default OutfitCard;

const styles = StyleSheet.create({
  outfitCard: {
    ...drawBorder(2, colors.LIGHT_GRAY, true),
    width: 275,
    height: '90%',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: -15,
  },
  outfitItem: {
    flex: 1,
    height: 'auto',
  },
  outfitItemImg: {
    resizeMode: 'cover',
    height: '100%',
    width: '100%',
  },
});