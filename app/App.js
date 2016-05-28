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

// Add item to Realm
_addItem () {
  if (this.state.input === '' ) return
  realm.write(() => {
    realm.create('Categories', { name: this.state.input })
  })
}

//Delete item from Realm
_deleteItem () {
  let itemToDelete =  favs.filtered('name = $0', name)
  realm.write(() => {
    realm.delete(itemToDelete)
  })
  this.forceUpdate()
}
