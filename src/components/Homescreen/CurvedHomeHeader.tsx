// // components/Home/CurvedHomeHeader.tsx
// import React from 'react';
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   StatusBar, 
//   TouchableOpacity,
//   ActivityIndicator 
// } from 'react-native';

// interface CurvedHomeHeaderProps {
//   memberName?: string;
//   loginDetails?: { loginType: string; id: number } | null;
//   isLoadingMemberName?: boolean;
//   onNotificationPress?: () => void;
// }

// const CurvedHomeHeader: React.FC<CurvedHomeHeaderProps> = ({ 
//   memberName = 'User',
//   loginDetails,
//   isLoadingMemberName = false,
//   onNotificationPress
// }) => {
//   return (
//     <View style={styles.container}>
//       <StatusBar backgroundColor="#007C91" barStyle="light-content" />
      
//       {/* Background Header with Curve - Beautiful Gradient */}
//       <View style={styles.topBanner}>
//         {/* Gradient Overlay for depth */}
//         <View style={styles.gradientOverlay} />
        
//         {/* Decorative Circles */}
//         <View style={styles.decorativeCircle1} />
//         <View style={styles.decorativeCircle2} />
//         <View style={styles.decorativeCircle3} />
        
//         {/* Header Content */}
//         <View style={styles.headerContent}>
//           {/* Top Row with Welcome and Notification */}
//           <View style={styles.topRow}>
//             <View style={styles.welcomeSection}>
//               <Text style={styles.welcomeText}>Welcome,</Text>
              
//               {isLoadingMemberName ? (
//                 <View style={styles.loadingContainer}>
//                   <ActivityIndicator size="small" color="#ffffff" />
//                   <Text style={styles.loadingText}>Loading...</Text>
//                 </View>
//               ) : (
//                 <Text style={styles.memberNameText}>
//                   {memberName}!
//                 </Text>
//               )}
//             </View>
            
//             {/* Notification Icon */}
//             <TouchableOpacity 
//               style={styles.notificationButton}
//               onPress={onNotificationPress}
//               activeOpacity={0.7}
//             >
//               <View style={styles.notificationIcon}>
//                 <Text style={styles.bellIcon}>🔔</Text>
//                 {/* Notification Badge */}
//                 <View style={styles.notificationBadge}>
//                   <Text style={styles.badgeText}>3</Text>
//                 </View>
//               </View>
//             </TouchableOpacity>
//           </View>
          
//           {/* User Details */}
//           {loginDetails && (
//             <View style={styles.userDetailsContainer}>
//               <View style={styles.detailItem}>
//                 <Text style={styles.detailLabel}>Logged in as:</Text>
//                 <Text style={styles.detailValue}>{loginDetails.loginType}</Text>
//               </View>
//               <View style={styles.detailSeparator} />
//               <View style={styles.detailItem}>
//                 <Text style={styles.detailLabel}>User ID:</Text>
//                 <Text style={styles.detailValue}>{loginDetails.id}</Text>
//               </View>
//             </View>
//           )}
//         </View>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#ffffff',
//   },
//   topBanner: {
//     minHeight: 160,
//     paddingTop: (StatusBar.currentHeight || 20) + 10,
//     paddingHorizontal: 24,
//     paddingBottom: 24,
//     borderBottomLeftRadius: 30,
//     borderBottomRightRadius: 30,
//     overflow: 'hidden',
//     position: 'relative',
//     // Beautiful gradient background
//     backgroundColor: '#007C91',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 8,
//   },
//   gradientOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0, 124, 145, 0.1)',
//   },
//   decorativeCircle1: {
//     position: 'absolute',
//     top: -50,
//     right: -30,
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//   },
//   decorativeCircle2: {
//     position: 'absolute',
//     top: 20,
//     right: 50,
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: 'rgba(255, 255, 255, 0.05)',
//   },
//   decorativeCircle3: {
//     position: 'absolute',
//     bottom: -20,
//     left: -20,
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: 'rgba(255, 255, 255, 0.08)',
//   },
//   headerContent: {
//     flex: 1,
//     justifyContent: 'space-between',
//     zIndex: 1,
//   },
//   topRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 20,
//   },
//   welcomeSection: {
//     flex: 1,
//   },
//   welcomeText: {
//     fontSize: 18,
//     color: 'rgba(255, 255, 255, 0.9)',
//     fontWeight: '500',
//     marginBottom: 4,
//     textShadowColor: 'rgba(0, 0, 0, 0.3)',
//     textShadowOffset: { width: 0, height: 1 },
//     textShadowRadius: 2,
//   },
//   memberNameText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#ffffff',
//     textShadowColor: 'rgba(0, 0, 0, 0.3)',
//     textShadowOffset: { width: 0, height: 1 },
//     textShadowRadius: 2,
//   },
//   loadingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 4,
//   },
//   loadingText: {
//     fontSize: 16,
//     color: 'rgba(255, 255, 255, 0.8)',
//     marginLeft: 8,
//     fontWeight: '500',
//   },
//   notificationButton: {
//     padding: 8,
//   },
//   notificationIcon: {
//     position: 'relative',
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.3)',
//   },
//   bellIcon: {
//     fontSize: 20,
//     color: '#ffffff',
//   },
//   notificationBadge: {
//     position: 'absolute',
//     top: -2,
//     right: -2,
//     backgroundColor: '#ff3b30',
//     borderRadius: 12,
//     minWidth: 24,
//     height: 24,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: '#ffffff',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.3,
//     shadowRadius: 3,
//     elevation: 3,
//   },
//   badgeText: {
//     fontSize: 12,
//     color: '#ffffff',
//     fontWeight: 'bold',
//   },
//   userDetailsContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.15)',
//     borderRadius: 16,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.2)',
//     shadowColor: 'rgba(0, 0, 0, 0.1)',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
//   detailItem: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   detailSeparator: {
//     width: 1,
//     height: 30,
//     backgroundColor: 'rgba(255, 255, 255, 0.3)',
//     marginHorizontal: 16,
//   },
//   detailLabel: {
//     fontSize: 12,
//     color: 'rgba(255, 255, 255, 0.8)',
//     marginBottom: 4,
//     textAlign: 'center',
//   },
//   detailValue: {
//     fontSize: 14,
//     color: '#ffffff',
//     fontWeight: '600',
//     textAlign: 'center',
//     textShadowColor: 'rgba(0, 0, 0, 0.3)',
//     textShadowOffset: { width: 0, height: 1 },
//     textShadowRadius: 1,
//   },
// });

// export default CurvedHomeHeader;