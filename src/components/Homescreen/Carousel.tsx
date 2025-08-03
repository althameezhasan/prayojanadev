import React, { useState, useCallback, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { useAuth } from '../../context/AuthContext'; // Adjust path as needed

const { width: screenWidth } = Dimensions.get('window');
const CAROUSEL_ITEM_WIDTH = screenWidth - 80; // Account for left/right margins

// Sample carousel data - replace with your actual images
const carouselData = [
  {
    id: '1',
    image: require('../../../assets/image/carousel.png'), // Default path
    memberImage: require('../../../assets/image/Member/carousel.png'), // Member path
    title: 'Health Tips',
    subtitle: 'Stay healthy with daily exercises',
  },
  {
    id: '2',
    image: require('../../../assets/image/carousel.png'), // Default path
    memberImage: require('../../../assets/image/Member/carousel.png'), // Member path
    title: 'Medication Reminder',
    subtitle: 'Never miss your medicine schedule',
  },
  {
    id: '3',
    image: require('../../../assets/image/carousel.png'), // Default path
    memberImage: require('../../../assets/image/Member/carousel.png'), // Member path
    title: 'Community Events',
    subtitle: 'Join upcoming community activities',
  },
];

// Create looped data for infinite scroll
const createLoopedData = (data: typeof carouselData) => {
  return [...data, ...data, ...data]; // Triple the data for smooth looping
};

interface CarouselProps {
  data?: typeof carouselData;
}

const Carousel: React.FC<CarouselProps> = ({ data = carouselData }) => {
  const { state } = useAuth(); // Get auth state
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(data.length); // Start at the first "real" item
  const carouselRef = useRef<FlatList>(null);
  
  // Check if user is a member
  const isMember = useMemo(() => {
    return state.user?.loginDetails?.loginType?.toLowerCase() === 'member';
  }, [state.user?.loginDetails?.loginType]);

  // Create data with appropriate image paths based on user type
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      currentImage: isMember ? item.memberImage : item.image,
    }));
  }, [data, isMember]);

  const loopedData = createLoopedData(processedData);

  // Initialize carousel position after mount
  React.useEffect(() => {
    const timer = setTimeout(() => {
      carouselRef.current?.scrollToIndex({ index: data.length, animated: false });
    }, 100);
    return () => clearTimeout(timer);
  }, [data.length]);

  const onCarouselScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    setCurrentCarouselIndex(roundIndex);
  };

  const onScrollEnd = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    
    // Handle looping
    if (roundIndex >= loopedData.length - data.length) {
      // Near the end, jump to the beginning
      carouselRef.current?.scrollToIndex({ index: data.length, animated: false });
      setCurrentCarouselIndex(data.length);
    } else if (roundIndex < data.length) {
      // Near the beginning, jump to the end
      carouselRef.current?.scrollToIndex({ index: loopedData.length - (data.length * 2) + roundIndex, animated: false });
      setCurrentCarouselIndex(loopedData.length - (data.length * 2) + roundIndex);
    } else {
      setCurrentCarouselIndex(roundIndex);
    }
  };

  const renderCarouselItem = ({ item, index }: { item: any, index: number }) => (
    <TouchableOpacity style={styles.carouselItem} activeOpacity={0.8}>
      <ImageBackground
        source={item.currentImage} // Use the processed image based on user type
        style={styles.carouselImage}
        imageStyle={[styles.carouselImageStyle, { resizeMode: 'contain' }]}
      >
        <View style={styles.carouselOverlay}>
          <Text style={styles.carouselTitle}>{item.title}</Text>
          <Text style={styles.carouselSubtitle}>{item.subtitle}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  const renderDot = (index: number) => {
    // Calculate the actual index for dot indicators
    const actualIndex = (currentCarouselIndex - data.length) % data.length;
    const normalizedActualIndex = actualIndex < 0 ? actualIndex + data.length : actualIndex;
    
    return (
      <View
        key={index}
        style={[
          styles.dot,
          index === normalizedActualIndex ? styles.activeDot : styles.inactiveDot,
        ]}
      />
    );
  };

  return (
    <View style={styles.carouselContainer}>
      <FlatList
        ref={carouselRef}
        data={loopedData}
        renderItem={renderCarouselItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onCarouselScroll}
        onMomentumScrollEnd={onScrollEnd}
        scrollEventThrottle={16}
        snapToInterval={CAROUSEL_ITEM_WIDTH + 16} // Add margin space
        decelerationRate="fast"
        contentContainerStyle={styles.carouselContent}
        getItemLayout={(data, index) => ({
          length: CAROUSEL_ITEM_WIDTH + 16,
          offset: (CAROUSEL_ITEM_WIDTH + 16) * index,
          index,
        })}
      />
      
      {/* Dot Indicators */}
      <View style={styles.dotContainer}>
        {data.map((_, index) => renderDot(index))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  carouselContent: {
    paddingHorizontal: 32,
  },
  carouselItem: {
    width: CAROUSEL_ITEM_WIDTH,
    height: 130,
    marginHorizontal: 8,
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselImageStyle: {
    borderRadius: 12,
  },
  carouselOverlay: {
    padding: 14,
    alignItems: 'flex-start',
  },
  carouselTitle: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'left',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  carouselSubtitle: {
    color: '#000',
    fontSize: 14,
    textAlign: 'left',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#007bff',
  },
  inactiveDot: {
    backgroundColor: '#ccc',
  },
});

export default Carousel;