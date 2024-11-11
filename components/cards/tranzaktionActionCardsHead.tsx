// TransactionActionCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

interface TransactionActionCardProps {
    title: string;
    icon: React.ReactNode;
    desc: number | string
    onPress: () => void;
}
const { width, height } = Dimensions.get('window')


const TransactionActionHeadCard = ({ title, desc, icon, onPress }: TransactionActionCardProps) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            {icon}
            <View style={{ alignItems: 'center', marginTop: 6 }}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.desc}>{desc}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '99%',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 16,
        paddingVertical: 22,
        marginBottom: 12,
        borderRadius: 8,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
        elevation: 3,
    },
    title: {
        fontSize: 16,
        marginLeft: 10, // Space between icon and text
    },
    desc: {
        fontSize: 26,
        marginLeft: 10, // Space between icon and text
    },
});

export default TransactionActionHeadCard;
