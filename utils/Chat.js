import React, { Component, createRef } from 'react';
import { View, Dimensions, Text, TextInput, FlatList, Button, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableOpacity , Alert} from 'react-native'
import io from 'socket.io-client'
export default class Chat extends Component{
    state = {
        chatMessage: "",
        chatMessages: [],
     }
    flatList = createRef()
    componentDidMount(){
        this.socket = io('https://gramophone-app.keshavthosar.repl.co/')
        console.log(this.props.username)
        this.socket.emit('joinRoom', {room: this.props.roomID, user: this.props.username})
        this.socket.on("message", msg => {
            this.setState({ chatMessages: [...this.state.chatMessages, msg]   
            });
            if(this.flatList.current){this.flatList.current.scrollToEnd()}
        });
        this.socket.on("joinedRoom", user => {
            this.setState({ chatMessages: [...this.state.chatMessages, {notif: true ,message: user.user, key:(this.state.chatMessages.length + 1).toString()}]});
            console.log(user.user)
        })
        this.socket.on("queueUpdated", () => {
            fetch('https://gramophone-app.keshavthosar.repl.co/fetchPlaylist/'+this.props.roomID)
            .then((response) => response.json())
            .then((json) => {
            this.props.updatePlaylist(json.playlist)
            this.setState({ chatMessages: [...this.state.chatMessages, {notif: true ,message: "Playlist Updated", key:(this.state.chatMessages.length + 1).toString()}]});
            })
            .catch((error) => console.error(error))
        })
    }
    componentWillUnmount(){
        this.socket = null
    }
    submitChatMessage() {
        this.socket.emit('chatMessage', {room: this.props.roomID, message: this.state.chatMessage, user:this.props.username});
        this.setState({ chatMessages: [...this.state.chatMessages, {self: true, user:'You', message: this.state.chatMessage, key: (this.state.chatMessages.length + 1).toString()}]});
        this.setState({chatMessage: ''});
        if(this.flatList.current){this.flatList.current.scrollToEnd()}
    }
    render() {
        if (this.props.selected){
        return (

        <KeyboardAvoidingView 
        style={{flex: 1}}
        behavior='padding'
        keyboardVerticalOffset={
            Platform.select({
                ios: () => 0,
                android: () => -150
            })()}
        >
        <View style={{marginTop: 10, marginBottom: 50}}>
            <FlatList
            ref={this.flatList}
            data = {this.state.chatMessages} 
            renderItem={({item}) => {
                if(item.self == true){
                    return (
                <View style={{
                    paddingRight: 10,
                }}>
                    <Text style={{...styles.message, textAlign: 'right', fontSize: 18, color: 'coral'}}>{item.user}</Text>
                    <Text style={{...styles.message, textAlign: 'right'}}>{item.message}</Text>
                </View>
                )}else if(item.notif == true){
                    return(
                        <Text style={{...styles.message, textAlign: 'center', color: 'lightgrey'}}>{item.message}</Text>
                    )

                }else {
                    return(
                    <View>
                        <Text style={{...styles.message, fontSize: 18, color: 'skyblue', paddingLeft: 10}}>{item.user}</Text>
                        <Text style={{...styles.message, paddingLeft: 10}}>{item.message}</Text>
                    </View>
                )}
            }}
            />
        </View>
                <TouchableOpacity style={{
                    flex: 1,
                    position: 'absolute',
                    bottom: 60,
                    right: 10,

                }} onPress={() => Alert.alert("Share the Room ID", this.props.roomID,  [{text: "Sure"}], {cancelable: true})}>
                    <Text style={{
                        fontSize:24,
                        padding: 6,
                        color: 'white',
                        borderRadius: 24,
                        height: 48,
                        width: 48,
                        backgroundColor: 'skyblue',
                        textAlign:'center',
                        opacity: 0.6,
                    }}>+</Text> 
                </TouchableOpacity>
            <View style={styles.container}>
                <TextInput
                        ref={input => { this.textInput = input }}
                        placeholder = { 'Type a message' }
                        style={{
                            width: '85%',
                            height: 40,
                            paddingHorizontal: 10,
                            borderBottomLeftRadius: 5,
                            borderTopLeftRadius: 5,
                            backgroundColor: 'white'
                        }}
                        onChangeText={chatMessage => {
                            this.setState({chatMessage});
                        }}
                />
                <TouchableOpacity style={{
                    borderBottomRightRadius: 5,
                    borderTopRightRadius: 5,
                }} onPress={() => {this.submitChatMessage(); this.textInput.clear()}}>
                    <Text style={{
                        fontSize: 18,
                        paddingLeft: 6,
                        paddingRight: 6,
                        paddingVertical: 8,
                        textAlign: 'center',
                        backgroundColor: 'skyblue',
                        borderTopRightRadius: 5,
                        borderBottomRightRadius: 5,
                        color: 'white'
                        }}>Send</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
        )

    }else{
        return null
    }
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#ddd',
        paddingHorizontal: 5,
        paddingVertical: 5,
        position: 'absolute',
        bottom: 0,
        width: '100%',

    },
    message:{
        fontSize: 16,
    },
    sentMessage:{
        fontSize: 16,
        textAlign: 'center',
    }
  });