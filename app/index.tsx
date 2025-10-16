import Button from "@/components/shared/Button";
import { images } from "@/constants/images";
import { Image, StyleSheet, Text, View } from 'react-native';

export default function Index() {
  return (
    <View
      style={styles.pageContainer}
    >
      <View style={[styles.contentBox, styles.contentBoxTop]}>
        <Image source={images.icon} style={styles.appIcon} />
        <Image source={images.bubbles} style={styles.imgBubble} resizeMode="contain" />
      </View>
      <View style={[styles.contentBox, styles.contentBoxMiddle]}>
        <Text style={styles.regularText}>Dress without a fuss</Text>
      </View>
      <View style={[styles.contentBox, styles.contentBoxBottom]}>
        <Button text="Start" onPress={() => console.log('testing...')} />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    alignItems: "center",
  },
  contentBox: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  contentBoxTop: {
    marginTop: 60,
    overflow: 'visible',
  },
  contentBoxMiddle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentBoxBottom: {
    marginTop: 100,
    minHeight: 150,
  },
  appIcon: {
    width: 129,
    height: 115,
  },
  imgBubble: {
    width: '100%',
    height: 300
  },
  regularText: {
    fontFamily: 'Inter',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: 0,
    textAlign: 'center',
    verticalAlign: 'middle',

  }
});
