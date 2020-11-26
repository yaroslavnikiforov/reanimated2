import React from 'react';
import {StyleSheet, View, NativeModules, Dimensions} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withDecay,
} from 'react-native-reanimated';
import {PanGestureHandler} from 'react-native-gesture-handler';
import {clamp, withBouncing} from 'react-native-redash';

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
      translateX.value = clamp(
        ctx.offsetX + event.translationX,
        leftClamp,
        rightClamp,
      );
      translateY.value = clamp(
        ctx.offsetY + event.translationY,
        topClamp,
        bottomClamp,
      );
    },
    onEnd: (event, ctx) => {
      translateX.value = withBouncing(
        withDecay({velocity: event.velocityX}),
        leftClamp,
        rightClamp,
      );

      translateY.value = withBouncing(
        withDecay({velocity: event.velocityY}),
        topClamp,
        bottomClamp,
      );
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
