import firestore from '@react-native-firebase/firestore';
import React, {useState} from 'react';
import { StyleSheet, TextInput, View, Text, YellowBox, FlatList, TouchableOpacity, Alert} from 'react-native';

export default function Search({selected, playlist, updatePlaylist, socket, roomID}){
    const [searchResults, setSearchResults] =  useState([])
    const [count, setCount] = useState(0)
      const dbh = firestore();
      const query = (str) => {
        let keywords = str.toLowerCase().split(" ")
        dbh.collection("search").where("keywords", "array-contains-any", keywords)
                .get()
                .then(function(querySnapshot) {
                    let temp=[]
                    querySnapshot.forEach(function(doc) {
                        temp.push({id: doc.id, ...doc.data(), key: (count).toString()});
                        setCount(() => count + 1)
                        console.log(doc.data())
                    });
                    setSearchResults([...temp])
                })
                .catch(function(error) {
                    console.log("Error getting documents: ", error);
                });
      }
      return(

        <View>
        { selected?(

          <View>
            <TextInput style={styles.search} onChangeText={(str) => {query(str)}}/>
            {searchResults.length > 0 ? (
            <FlatList
            data={searchResults}
            renderItem={({ item }) => (
                <View style={styles.searchResult}>
                    <Text>{item.title}</Text>
                    <View  style={{
                        position: 'absolute',
                        right:5,
                        
                    }}>
                    <TouchableOpacity onPress={() => {
                        updatePlaylist([...playlist, item]);
                        if(socket != null) {socket.emit('addSong', {room: roomID, music_object: item})}
                        Alert.alert('',`${item.title} was successfully added to the queue`, [{text: "Great!"}], {cancelable: true});
                        }
                        }>
                        <Text style={{
                            fontSize: 18,
                            color: 'lightgreen',
                            borderRadius: 24,
                            paddingHorizontal: 12,
                            paddingVertical: 4,
                            textAlign:'center',
                            borderColor: 'lightgreen',
                            borderWidth: 1,
                        }}>+</Text>
                    </TouchableOpacity> 
                    </View>
                </View>
                )}/>
            )
            :
            (
                <Text style={{textAlign: 'center', marginTop: 10}}>No Results Found</Text>
            )}
            </View>): null}
          </View>
      )
}
const styles = StyleSheet.create({
    search: {
        height: 42,
        borderRadius:5,
        borderColor: 'coral',
        borderWidth: 2,
        marginTop: 10,
        marginHorizontal: 10,
        paddingHorizontal: 10,
    },
    searchResult: {
        flexDirection: 'row',
        margin: 10,
        borderColor: 'lightgrey',
        borderWidth: 1,
        padding : 20,
        borderRadius: 5,
        alignItems: 'center',
    }
})