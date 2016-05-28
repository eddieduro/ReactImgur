import React, {
  View,
  Text,
  Component,
  StyleSheet,
  TouchableHighlight,
  ScrollView,
  Image,
  Dimensions,
  ListView
} from 'react-native'

//Use Dimensions to calculate the window width. We will use this to set the style of our images
let windowWidth = Dimensions.get('window').width

//import our API
import API from './api'

//Create a new ListView datasource and store it in a variable for later.
let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 })

class ViewImages extends Component {
  constructor (props) {
    super(props)
    this.state = {
      dataSource: ds,
      loading: true,
      images: []
    }
  }
// Use the api to fetch the images, and we pass this.props.category to the function. This.props.category will be passed down as a prop. We then set the dataSource array to response.data.items, and set loading to false.
  componentDidMount () {
    API.get(this.props.category)
      .then((response) => {
        this.setState({
          dataSource: ds.cloneWithRows(response.data.items),
          loading: false
        })
      }, (error) => {
        console.log('error:', error)
    })
  }
// Check the image link to see if it is either a gif, jpg, or png file, if it is not we do not return anything. If it is one of these types of image, we return an Image and set the source as the link property (returned from imgur) of rowData.
  renderRow (rowData) {
    if (rowData.link.match(/\.(jpg\png\gif)/g)) {
      return (
        <View>
          <Image
            source={{ uri: rowData.link }}
            style={{width: windowWidth, height: windowWidth}} />
        </View>)
    } else {
      return null
    }
  }

  render () {
    let { loading, images } = this.state
    // If loading is true, images is assigned to a loading message.
    if (loading) {
      images = (
        <View style={style.loadingContainer}>
          <Text style={style.loading}>Loading images…</Text>
        </View>)
    }
    //If loading is false, images is assigned to our ListView.
    if (!loading) {
      images = <ListView
                 dataSource={this.state.dataSource}
                 renderRow={this.renderRow.bind(this)} />
    }
    return (
      <View style={{flex: 1}}>
        <TouchableHighlight
          underlayColor=’transparent’
          onPress={this.props.closeModal.bind(this)}
          style={style.closeButton}>
          <Text style={style.closeButtonText}>CLOSE</Text>
        </TouchableHighlight>
        <ScrollView style={{flex: 1}}>
          {images}
        </ScrollView>
      </View>
    )
  }
}
