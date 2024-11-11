import { View, Text, StyleSheet } from 'react-native';
import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from "expo-router";
import { INavigationProps } from "@/types/navigation/navigation";
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';

const NavigationMenu = ({ toggleModal, name, deleteIcon, all = false, delOnPress, editIcon, editOnPress, addOnPress, navigate }: INavigationProps) => {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <Feather name="chevron-left" size={30} color="#000" onPress={navigate ? navigate : () => navigation.goBack()} />
            <Text style={styles.title}>{name}</Text>
            {deleteIcon
                ? <MaterialIcons name="delete" size={25} color="#ff5e2c" onPress={toggleModal} />
                : <Text style={{}}></Text>
            }
           
            {all ?
                <View style={{ gap: 10, flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="add-circle-outline" size={25} color="#ff5e2c" onPress={addOnPress} />
                    <AntDesign name="edit" size={25} color="#ff5e2c" onPress={editOnPress} />
                    <MaterialIcons name="delete" size={25} color="#ff5e2c" onPress={delOnPress} />
                </View> : ''}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // marginHorizontal: 7,
        paddingTop: 10,
        backgroundColor: 'transparent'
    },
    title: {
        color: '#000',
        fontSize: 20,
        fontWeight: "700"
    },
});

export default NavigationMenu;
