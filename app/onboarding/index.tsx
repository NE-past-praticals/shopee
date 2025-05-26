import React, { useRef, useState } from "react";
import { StyleSheet, Text, View, FlatList, Dimensions, Pressable, Image } from "react-native";
import { useRouter } from "expo-router";
import { useOnboardingStore } from "@/stores/onboardingStore";
import Colors from "@/constants/colors";
import Fonts from "@/constants/fonts";
import Button from "@/components/Button";
import { ShoppingBag, Search, CreditCard, User } from "lucide-react-native";
import Animated, { FadeIn, FadeInRight, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

const { width } = Dimensions.get("window");

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  image?: string;
}

const slides: OnboardingSlide[] = [
  {
    id: "1",
    title: "Welcome to ShopApp",
    description: "Discover thousands of products and shop with ease",
    icon: <ShoppingBag size={80} color={Colors.primary} />,
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Find What You Love",
    description: "Browse categories and search for your favorite products",
    icon: <Search size={80} color={Colors.primary} />,
    image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=2115&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Easy Checkout",
    description: "Add to cart and checkout with just a few taps",
    icon: <CreditCard size={80} color={Colors.primary} />,
    image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?q=80&w=2115&auto=format&fit=crop",
  },
  {
    id: "4",
    title: "Create Your Profile",
    description: "Sign up to track orders and save your favorites",
    icon: <User size={80} color={Colors.primary} />,
    image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=2070&auto=format&fit=crop",
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { completeOnboarding } = useOnboardingStore();
  const buttonScale = useSharedValue(1);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    completeOnboarding();
    router.replace("/");
  };

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
  };
  
  const handlePressIn = () => {
    buttonScale.value = withSpring(0.95, { damping: 10, stiffness: 300 });
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1, { damping: 10, stiffness: 300 });
  };
  
  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  const renderItem = ({ item, index }: { item: OnboardingSlide, index: number }) => {
    return (
      <Animated.View 
        style={styles.slide}
        entering={FadeInRight.delay(index * 100).springify()}
      >
        {item.image ? (
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: item.image }} 
              style={styles.image} 
              resizeMode="cover"
            />
            <View style={styles.overlay} />
            <Animated.View 
              style={styles.iconOverlay}
              entering={FadeIn.delay(300).duration(800)}
            >
              {item.icon}
            </Animated.View>
          </View>
        ) : (
          <View style={styles.iconContainer}>{item.icon}</View>
        )}
        
        <View style={styles.textContainer}>
          <Animated.Text 
            style={styles.title}
            entering={FadeIn.delay(400).duration(800)}
          >
            {item.title}
          </Animated.Text>
          <Animated.Text 
            style={styles.description}
            entering={FadeIn.delay(500).duration(800)}
          >
            {item.description}
          </Animated.Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={handleScroll}
      />

      <Animated.View 
        style={styles.pagination}
        entering={FadeIn.delay(600).duration(800)}
      >
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === currentIndex && styles.paginationDotActive,
            ]}
          />
        ))}
      </Animated.View>

      <Animated.View 
        style={styles.buttonsContainer}
        entering={FadeIn.delay(700).duration(800)}
      >
        {currentIndex < slides.length - 1 ? (
          <>
            <Pressable 
              style={styles.skipButton} 
              onPress={handleSkip}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <Text style={styles.skipButtonText}>Skip</Text>
            </Pressable>
            <Animated.View style={animatedButtonStyle}>
              <Button title="Next" onPress={handleNext} style={styles.nextButton} />
            </Animated.View>
          </>
        ) : (
          <Animated.View style={[styles.getStartedContainer, animatedButtonStyle]}>
            <Button
              title="Get Started"
              onPress={handleComplete}
              style={styles.getStartedButton}
            />
          </Animated.View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  slide: {
    width,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    width: "100%",
    height: "60%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  iconOverlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -40 }, { translateY: -40 }],
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 50,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: {
    marginBottom: 40,
    backgroundColor: Colors.card,
    borderRadius: 50,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  textContainer: {
    paddingHorizontal: 40,
    paddingVertical: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.placeholder,
    textAlign: "center",
    lineHeight: 24,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.border,
    marginHorizontal: 5,
  },
  paginationDotActive: {
    backgroundColor: Colors.primary,
    width: 20,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  skipButton: {
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  skipButtonText: {
    color: Colors.placeholder,
    fontSize: 16,
    fontFamily: Fonts.semiBold,
  },
  nextButton: {
    flex: 1,
    marginLeft: 20,
  },
  getStartedContainer: {
    flex: 1,
  },
  getStartedButton: {
    flex: 1,
  },
});