import React from 'react';
import {StyleSheet, View, NativeModules, Dimensions} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withDecay,
} from 'react-native-reanimated';
import {PanGestureHandler} from 'react-native-gesture-handler';

const {StatusBarManager} = NativeModules;

const CARD_WIDTH = 200;
const CARD_HEIGHT = 200;
const {width, height} = Dimensions.get('window');
const gutter = 16;

const leftClamp = 0;
const rightClamp = width - CARD_WIDTH - gutter * 2;
const topClamp = 0;
const bottomClamp = height - CARD_HEIGHT - StatusBarManager.HEIGHT - gutter;

export default function App() {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      ctx.offsetX = translateX.value;
      ctx.offsetY = translateY.value;
    },
    onActive: (event, ctx) => {
      const newTranslateXValue = ctx.offsetX + event.translationX;
      const newTranslateYValue = ctx.offsetY + event.translationY;

      if (newTranslateXValue <= leftClamp) {
        translateX.value = leftClamp;
      } else if (newTranslateXValue >= rightClamp) {
        translateX.value = rightClamp;
      } else {
        translateX.value = newTranslateXValue;
      }

      if (newTranslateYValue <= topClamp) {
        translateY.value = topClamp;
      } else if (newTranslateYValue >= bottomClamp) {
        translateY.value = bottomClamp;
      } else {
        translateY.value = newTranslateYValue;
      }
    },
    onEnd: (event, ctx) => {
      translateX.value = withDecay({
        velocity: event.velocityX,
        clamp: [leftClamp, rightClamp],
      });
      translateY.value = withDecay({
        velocity: event.velocityY,
        clamp: [topClamp, bottomClamp],
      });
    },
  });

  const style = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}, {translateY: translateY.value}],
  }));

  return (
    <View style={styles.container}>
      <PanGestureHandler {...{onGestureEvent}}>
        <Animated.View {...{style}}>
          <View style={styles.card} />
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopWidth: StatusBarManager.HEIGHT,
    borderLeftWidth: gutter,
    borderRightWidth: gutter,
    borderBottomWidth: gutter,
    borderColor: '#1b96c0',
    backgroundColor: 'pink',
  },

  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: 'black',
  },
});
