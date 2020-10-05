import React , {useState} from 'react'
import {Text, View, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Keyboard} from 'react-native'
import Search from '../utils/Search'
import PlayerScreen from '../utils/PlayerScreen'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
export default function Room ({navigation}) {
    const [selected, setSelected] = useState(1)
    const iconSize = 48
    const [playlist, updatePlaylist] = useState([])

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{flex: 1, backgroundColor:'white'}}>
            <View style={styles.container}>
                <TouchableOpacity onPress={() => {setSelected(1); console.log(1)}}>
                    <View style={styles.options}>
                        <MaterialIcons name="headset" size={iconSize} color={selected == 1 ?"coral": "black"} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {setSelected(2); console.log(2)}}>
                    <View style={styles.options}>
                        <MaterialIcons name="search" size={iconSize}  color={selected == 2?"coral": "black"} />
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'row'}}>
                <Text style={selected == 1? styles.underline_selected:  styles.underline}></Text>
                <Text style={selected == 2? styles.underline_selected: styles.underline}></Text>
            </View> 
            <View style={styles.tabContent}>
                    <PlayerScreen selected={selected == 1} playlist={playlist} roomID={null} username={null}/>
                    <Search selected={selected == 2} playlist={playlist} updatePlaylist={updatePlaylist}s/>
            </View>    
        </View>
        </TouchableWithoutFeedback>

    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        flexDirection: 'row',
        justifyContent: 'space-around',

    },
    options:{
        alignItems:'center',
        
    },
    underline_selected: {
        flex:1,
        borderBottomWidth: 2,
        width:'100%',
        borderColor: 'coral',
    },
    underline: {
        flex:1,
        borderBottomWidth: 1,
        borderColor: 'lightgrey',  
    },
    tabContent: {
        flex:1,
    }

})
