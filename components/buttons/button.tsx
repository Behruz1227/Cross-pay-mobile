import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { IButton } from "@/types/button/button";
import { Colors } from '@/constants/Colors';

const Buttons: React.FC<IButton> = ({ title, backgroundColor = Colors.dark.primary, bordered = false, icon, textColor = 'white', textSize = 18, onPress, isDisebled = true, loading = false }) => {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor: !isDisebled || loading ? 'gray' : backgroundColor, borderWidth: bordered ? 1.5 : 0, borderColor: '#9C0A35' }
            ]}
            onPress={onPress}
            activeOpacity={.8}
            disabled={!isDisebled}
        >
            {icon ? icon : ''}
            <Text style={[styles.buttonText, { color: textColor }, { fontSize: textSize }]}>
                {title}
            </Text>
            {loading && <ActivityIndicator size="small" color={textColor} style={styles.loader} />}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 10
    },
    buttonText: {
        fontWeight: '500',
    },
    loader: {
        marginLeft: 20,
    },
});

export default Buttons;
