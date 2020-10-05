import React, {createRef} from 'react'
import { StyleSheet, TouchableOpacity, View, Image, Text, FlatList, Modal} from 'react-native'
import  Ionicons  from 'react-native-vector-icons/Ionicons'
import TrackPlayer from 'react-native-track-player'

export default class Player extends React.Component {
  state = {
    selected: this.props.selected,
    isPlaying: false,
    currentIndex: 0,
    isBuffering: false,
    playlist: this.props.playlist,
    artwork: "https://clipartspub.com/images/headphones-clipart-vector-4.jpg",
    modalVisible : false,
  }

  async componentDidMount() {
    try {
      TrackPlayer.setupPlayer();
      
      await TrackPlayer.add(this.state.playlist);
    } catch (e) {
      console.log(e)
    }
  }

  async componentDidUpdate(previousProps){
    if(JSON.stringify(this.props.playlist) !== JSON.stringify(previousProps.playlist)){
      let position = await TrackPlayer.getPosition()
      console.log('state updated')
      this.setState({
        playlist: this.props.playlist,
        isPlaying: false,
        artwork: this.props.playlist[this.state.currentIndex].artwork
      })
      await TrackPlayer.reset();
      await TrackPlayer.add(this.state.playlist);
      TrackPlayer.skip(this.state.currentIndex.toString());
      await TrackPlayer.seekTo(position)
      this.handlePlayPause()


      }

  }
  componentWillUnmount(){
    TrackPlayer.destroy();
  }
  handlePlayPause = async () => {
    if(this.state.isPlaying){
      await TrackPlayer.pause()
      this.setState({ isPlaying: false})
      console.log("paused")
    }else{
        await TrackPlayer.play()
        this.setState({ isPlaying: true})
        console.log("playing")
      }
  }
  handleNextTrack = async () => {
    if (this.state.currentIndex < this.state.playlist.length){
      console.log("jumping to next track")
      await TrackPlayer.skipToNext().catch(err => console.log("cannot jump to next track"));
      try{
        this.setState({currentIndex: this.state.currentIndex + 1, artwork: this.props.playlist[this.state.currentIndex + 1].artwork})
      }catch(err){
        console.log("out of index")
      }
    }
  }
  handlePreviousTrack = async () => {
    if (this.state.currentIndex > 0){
      console.log("jumping to previous track")
      await TrackPlayer.skipToPrevious().catch(err => console.log("cannot jump to previous track"));
      try{
        this.setState({currentIndex: this.state.currentIndex - 1, artwork: this.props.playlist[this.state.currentIndex - 1].artwork})
      }catch(err){
        console.log("out of index")
      }
    }
  }
  
  render() {
      if(this.props.selected) {
        return (
        <View style={{flex: 1}}>
            <View style={styles.container}>
              <Image
                style={styles.albumCover}
                source={{uri: this.state.artwork}}
              />
              {this.state.playlist.length>0?
               <Text
               style={{
                 paddingTop: 10,
               }}
               >{this.state.playlist[this.state.currentIndex].title}</Text> 
               : null}
            </View>
          <View style={{flex: 1}}>
          {this.state.playlist.length > 0? (
            <View style={{flex: 1}}>

              <View style={styles.controls}>
                      <TouchableOpacity style={styles.control} onPress={this.handlePreviousTrack}>
                        <Ionicons name= 'play-skip-back' size={48} color='#444' />
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.control} onPress={this.handlePlayPause}>
                        {this.state.isPlaying ? (
                          <Ionicons name='ios-pause' size={48} color={'#444'} />
                        ) : (
                          <Ionicons name='ios-play-circle' size={48} color= '#444' />
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.control} onPress={this.handleNextTrack}>
                        <Ionicons name='play-skip-forward' size={48} color='#444' />
                      </TouchableOpacity>  
                </View>
                <TouchableOpacity onPress={() => this.setState({modalVisible: !this.state.modalVisible})}>
                  <View style={{alignItems: 'center'}}>
                    <Text style={{
                      width: 120,
                      fontSize:16,
                      textAlign: 'center',
                      padding: 10,
                      backgroundColor: '#ddd',
                      borderRadius: 24,
                      }}>Queue</Text>
                  </View>
                </TouchableOpacity>
              </View>
          ): (
            <View style={{alignItems: 'center',}}>
              <Text style={{
                marginTop: 20,
              }}>No songs added yet</Text>
            </View>
            )
          }
          
          <Modal
              animationType="slide"
              visible={this.state.modalVisible}
              >
              <TouchableOpacity onPress={() => this.setState({modalVisible: !this.state.modalVisible})}>
              <Text style={{
                fontSize:16,
                textAlign: 'center',
                padding: 10,
                backgroundColor: '#ddd',
                }}>Up Next</Text>
                </TouchableOpacity>
                <View style={{
                  flex: 1,
                  height: 60,
                  padding: 10,
                  borderWidth: 1,

                }}>

                <View style={{flex:1}}>
                  <FlatList
                  data = {this.state.playlist} 
                  renderItem={({item, index}) => (
                              <Text style={{
                                flex: 1,
                                width: '100%',
                                fontSize: 20,
                                borderWidth: 1,
                                padding: 10,
                                marginBottom: 10,
                              }}>{index==this.state.currentIndex? "Playing:":null}{item.title}</Text>
                          )
                  }
                  />
                </View>

              </View>
              </Modal>
          </View>
        </View>
        )
        }else{
          return null
        }
      }
    }
 
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  albumCover: {
    width: 250,
    height: 250
  },
  infoContainer: {
    height: 100,

  },
  trackInfo: {
    padding: 40,
    backgroundColor: '#fff'
  },
  trackInfoText: {
    textAlign: 'center',
    flexWrap: 'wrap',
    color: '#550088'
  },
  largeText: {
    fontSize: 22
  },
  smallText: {
    fontSize: 16
  },
  control: {
    margin: 20
  },
  controls: {
    flexDirection: 'row'
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center'

  }

})