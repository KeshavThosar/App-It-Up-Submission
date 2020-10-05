import React, {Component} from 'react'
import {View, Text, TextInput, StyleSheet, TouchableOpacity, Alert} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';

export default class CreateRoom extends Component{
    state = {
        roomID: "",
        username: "",
    }
    async save(){
        try {
          await AsyncStorage.setItem("username", this.state.username)
          Alert.alert("", `Good to see you here, ${this.state.username}`, [{text: "Thanks"}], {cancelable: true})
        } catch (error) {
          alert(error)
        }
    }
    async load(){
        try {
          let uname = await AsyncStorage.getItem("username")
          if(uname !== null){
            console.log(uname)
            this.setState({username:uname})
          }
        } catch (error) {
          alert(error)
        }
    }
    async remove(){
        try {
          await AsyncStorage.removeItem("username")
        } catch (error) {
          alert(error)
        }finally{
          setName("")
        }
    }
    componentDidMount(){
        fetch('https://gramophone-app.keshavthosar.repl.co/newRoom')
        .then((response) => response.json())
        .then((json) => {
            this.setState({roomID: json.id})
        })
        .catch((error) => console.error(error))
        this.load()
    }
    
    render(){
        return (
            <View style={styles.container}>
            <Text style={styles.title}>Room ID: {this.state.roomID}</Text>
            <View style={styles.userField}>
                <Text style={styles.userTitle}>Join as:</Text>
                <Text style={styles.userTitle}>{this.state.username}</Text>
            </View>
            <View>
                <TextInput style={
                    {
                    borderRadius: 5,
                    borderColor: 'coral',
                    borderWidth: 1,
                    marginTop: 10,
                    width: 140,
                    height: 40,
                    textAlign: 'center',
                    marginBottom: 10,
                    }
                    } 
                    onChangeText={(str) => this.setState({username: str})}
                    />
                <TouchableOpacity style={styles.changeUsername} onPress={() => this.save()}>
                    <Text style={{color: 'white'}}>Update Username</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={{...styles.changeUsername, 
            marginTop: 100,
            }}>
                <Text style={{
                    textAlign: 'center',
                    padding: 8,
                    margin: 8,
                    color: 'white',
                    fontSize: 18,
                
                }}
                onPress={() => { 
                    if( this.state.username === '' ){
                        Alert.alert("", 'Dear Unknown, please enter a username', [{text: 'Yeah...'}], {cancelable: true})
                    }else{
                        this.load().then(() => {
                            this.props.navigation.navigate('Room', {roomID: this.state.roomID,  username:this.state.username})
                        })
                    }
                }
                }>Join Room</Text>
            </TouchableOpacity>
            
        </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: 150,
    },
    title: {
        fontSize: 20,
    },
    textInput:{
        marginTop: 20,
        borderColor: 'coral',
        borderStyle: 'solid',
        borderWidth: 1,
        width: 140,
        height: 50,
        fontSize: 24,
        textAlign: 'center'
    },
    userField: {
        flexDirection: 'row',
        marginTop: 10,
        fontSize: 18,
        marginLeft: '5%',
        padding: 10,

    },
    userTitle: {
        paddingHorizontal: 5,
    },
    changeUsername: {
        borderRadius: 5,
        backgroundColor: 'coral',
        padding: 10,
        alignItems: 'center',
    }
})