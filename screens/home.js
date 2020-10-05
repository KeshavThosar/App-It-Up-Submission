import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

import Feather  from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';



function HomeScreen({navigation}) {
    const options = [
        {title: 'Listen Solo', key: '1'},
        {title: 'Join Room', key: '2'},
        {title: 'Create Room ', key: '3'},
    ]
    const clickHandler = (location) => {
        console.log(location)
        navigation.navigate(location)
    }
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => clickHandler('ListenSolo') }>
                <View style={styles.options}>
                    <Feather name="headphones" size={48} color="white" style={styles.icon}/>
                    <Text style={styles.optionTitle}>{options[0].title}</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => clickHandler('JoinRoom') }>
                <View style={styles.options}>
                    <Entypo name="globe" size={48} color="white" style={styles.icon}/>
                    <Text style={styles.optionTitle}>{options[1].title}</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => clickHandler('CreateRoom') }>
                <View style={{...styles.options,
                     paddingHorizontal: 24,
                }}>
                    <MaterialIcons name="people-outline" size={48} color="white" style={styles.icon}/>
                    <Text style={styles.optionTitle}>{options[2].title}</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: "30%",
        alignItems: 'center',
    },
    options:{
        padding: 14,
        paddingHorizontal: 32,
        borderRadius: 12,
        backgroundColor:'coral',
        alignItems:'center',
        margin: 10,
        
    },
    optionTitle: {
        color:'white',
        fontSize: 12,
        padding: 4,
    },

    icon: {
        paddingTop: 12,
    }
})

export default HomeScreen