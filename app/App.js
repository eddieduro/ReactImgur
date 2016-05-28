import React, {
  View,
  Text,
  Component,
  TextInput,
  StyleSheet,
  TouchableHighlight,
  ScrollView
} from 'react-native'

import Realm from 'realm'
import _ from 'lodash'

//Create Realm schema
let realm = new Realm({
  schema: [{name: 'Categories', properties: {name: 'string'}}]
})

//Query Realm for all Categories
let favs = realm.objects('Categories')

class App extends Component {

  constructor () {
    super()
    //set input as an empty string.
    this.state = {
      input: ''
    }
  }

  //_closeModal is a function that we will pass down as a prop to our ViewImages page to close the modal.
  _closeModal () {
    this.props.navigator.pop()
  }

  //set the state of our input variable so we can use it to create a new item in our Realm database
  _updateInput (input) {
    this.setState({ input })
  }

  // checks to see if we have anything other than an empty string in our input state, and if so it writes to the Realm database and creates a new item with the value of this.state.input
  _addItem () {
    if (this.state.input === '' ) return
    realm.write(() => {
      realm.create('Categories', { name: this.state.input })
    })
  }

  //filters through our list of item and does a check based on the item name. It then deletes the item from Realm database using the realm.delete function. We forceUpdate to reset the state of our app.
  _deleteItem () {
    let itemToDelete =  favs.filtered('name = $0', name)
    realm.write(() => {
      realm.delete(itemToDelete)
    })
    this.forceUpdate()
  }

  _viewImages (category) {
    this.props.navigator.push({
      name: 'ViewImages',
      passProps: {
        closeModal: this._closeModal,
        category
      }
    })
  }

  render () {
    //map over our favs items and return a View with our favs mapped into an array stored in our favorites variable
    let favorites = _.map(favs, (f, i) => {
      return (
        <View key={i} style={style.favoriteButtonContainer}>
        //a button to view the images for that item name
        <TouchableHighlight
          onPress={() => this._viewImages(f.name)}
          underlayColor='transparent'
          style={style.favorite}>
          <Text style={style.favoriteText}>{f.name}</Text>
        </TouchableHighlight>
        //a button to delete the item.
        <TouchableHighlight
          onPress={() => this._deleteItem(f.name)}
          underlayColor='transparent'
          style={style.deleteButton}>
          <Text style={style.deleteText}>&times;</Text>
        </TouchableHighlight>
      </View>)
    })
    return (
      <View style={style.container}>
        <View style={style.headingContainer}>
          <Text style={style.heading}>
            Welcome to Realm Imgur Viewer
          </Text>
        </View>
        <ScrollView style={style.mainContainer}>
          <TextInput
            value={this.state.input}
            onChangeText={(text) => this._updateInput(text)}
            style={style.input}
            placeholder='What Do You Like?' />
          <View style={style.buttonContainer}>
            <TouchableHighlight
              underlayColor='#3f62aa'
              style={[ style.button ]}
              onPress={() => this._addItem()}>
              <Text style={style.buttonText}>Add Item</Text>
            </TouchableHighlight>
          </View>
          <View style={style.favContainer}>
            <Text style={style.favorites}>FAVORITES</Text>
            {favorites}
          </View>
        </ScrollView>
      </View>
    )
  }
}
