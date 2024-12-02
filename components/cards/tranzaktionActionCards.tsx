// TransactionActionCard.js
import { responsivePixel, responsiveSpacing } from '@/hooks/customWidth';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

interface TransactionActionCardProps {
    title: string;
    icon: React.ReactNode;
    desc: any
    onPress?: () => void;
}
const { width, height } = Dimensions.get('window')


const TransactionActionCard = ({ title, desc, icon, onPress }: TransactionActionCardProps) => {
    return (
        <TouchableOpacity activeOpacity={0.9} style={styles.card}>
            {icon}
            <View>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.desc}>{desc}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '49%',
        flexDirection: 'row',
        alignItems: 'center',
        padding: responsivePixel(16),
        paddingVertical: responsiveSpacing(22),
        marginBottom: responsivePixel(12),
        borderRadius: responsivePixel(8),
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
        elevation: 3,
    },
    title: {
        fontSize: responsivePixel(16),
        color: 'gray',
        marginLeft: 10, // Space between icon and text
    },
    desc: {
        fontSize: responsivePixel(16),
        marginLeft: 10, // Space between icon and text
    },
});

export default TransactionActionCard;

