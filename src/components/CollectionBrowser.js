import React, { PureComponent } from 'react';
import {
  FlatList,
  Picker,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal
} from 'react-native';
import Database from '../data-access/database';
import SearchContainer from './SearchContainer';
import AddToSetlistModal from './modals/AddToSetlistModal';
import RemoveFromSetlistModal from './modals/RemoveFromSetlistModal';
import MoveToCollectionModal from './modals/MoveToCollectionModal';
import DeleteTuneModal from './modals/DeleteTuneModal';
import DetailsModal from './modals/DetailsModal';
import Constants from '../data-access/constants';

export default class CollectionBrowser extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      tunes: [],
      filteredTunes: [],
      searchText: '',
      rhythmFilter: '',
      keyFilter: '',
      modalVisible: false,
      modalContents: <View />
    };

    this.queryDatabaseState = this.queryDatabaseState.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.showModal = this.showModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    this.setSearchText = this.setSearchText.bind(this);
    this.setKeyFilter = this.setKeyFilter.bind(this);
    this.setRhythmFilter = this.setRhythmFilter.bind(this);
  }

  componentDidMount() {
    this.queryDatabaseState();
  }

  setSearchText(text) {
    return new Promise((resolve, reject) => {
      this.setState({
        searchText: text
      }, () => {
        this.onSearch();
      });
      resolve();
    });
  }

  setKeyFilter(text) {
    this.setState({
      keyFilter: text
    }, () => {
      this.onSearch();
    });
  }

  onSearch = () => new Promise((resolve, reject) => {
    const {
      searchText, rhythmFilter, keyFilter, tunes
    } = this.state;

    const searchResults = tunes.filter(tune => tune.Title.toLowerCase().includes(searchText.toLowerCase()));
    this.setState({
      filteredTunes: searchResults
    }, () => {
      const rhythmFilterResults = this.state.filteredTunes.filter(tune => tune.Rhythm.toLowerCase().includes(rhythmFilter.toLowerCase()));
      this.setState({
        filteredTunes: rhythmFilterResults
      }, () => {
        const keyFilterResults = this.state.filteredTunes.filter(tune => tune.Key.toLowerCase().includes(keyFilter.toLowerCase()));
        this.setState({
          filteredTunes: keyFilterResults
        });
      });
    });

    resolve();
  })

  setRhythmFilter(text) {
    this.setState({
      rhythmFilter: text
    }, () => {
      this.onSearch();
    });
  }

  closeModal() {
    this.setState({
      modalVisible: false
    }, () => {
      this.queryDatabaseState();
    });
  }

  queryDatabaseState() {
    const { collectionId, queriedBy } = this.props;
    Database.getTunesForCollection(collectionId, queriedBy).then((tunes) => {
      this.setState({ tunes }, () => { this.onSearch(); });
    });
  }

  renderItem = ({ item }) => {
    const { queriedBy, tuneChangeCallback } = this.props;

    let pickerOptions = [];
    if (queriedBy === Constants.CollectionTypes.COLLECTION) {
      pickerOptions = [
        <Picker.Item label="Cancel" value="cancel" key="cancel" />,
        <Picker.Item label="Details" value="details" key="details" />,
        <Picker.Item label="Add to Setlist" value="addToSetlist" key="addToSetlist" />,
        <Picker.Item label="Move to Collection" value="moveToCollection" key="moveToCollection" />,
        <Picker.Item label="Delete" value="delete" key="delete" />
      ];
    } else if (queriedBy === Constants.CollectionTypes.SETLIST) {
      pickerOptions = [
        <Picker.Item label="Cancel" value="cancel" key="cancel" />,
        <Picker.Item label="Details" value="details" key="details" />,
        <Picker.Item label="Remove from Setlist" value="removeFromSetlist" key="removeFromSetlist" />
      ];
    }

    return (
      <View style={styles.listItem}>
        <View>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={() => {
                if (tuneChangeCallback.callback) {
                  tuneChangeCallback.callback(item);
                }
              }}
            >
              <Text style={styles.listItemTitle}>
                {item.Title}
              </Text>
            </TouchableOpacity>
            <Picker
              style={{ height: 36, width: 30 }}
              onValueChange={(itemValue) => {
                this.showModal(itemValue, item);
              }}
            >
              {pickerOptions}
            </Picker>
          </View>
          <View>
            <Text style={styles.listItemDetail}>
              {`Key: ${item.Key}`}
              {(item.Rhythm ? `, Rhythm: ${item.Rhythm}` : '')}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  showModal(action, item) {
    let modalToShow;
    const { collectionId } = this.props;
    switch (action) {
      case 'addToSetlist':
        modalToShow = <AddToSetlistModal closeModal={() => this.closeModal()} tune={item} />;
        break;
      case 'removeFromSetlist':
        modalToShow = <RemoveFromSetlistModal closeModal={() => this.closeModal()} tune={item} collectionId={collectionId} />;
        break;
      case 'moveToCollection':
        modalToShow = <MoveToCollectionModal closeModal={() => this.closeModal()} tune={item} />;
        break;
      case 'details':
        modalToShow = <DetailsModal closeModal={() => this.closeModal()} tune={item} />;
        break;
      case 'delete':
        modalToShow = <DeleteTuneModal closeModal={() => this.closeModal()} tune={item} />;
        break;
      default:
        return;
    }

    this.setState({
      modalContents: modalToShow
    }, () => {
      this.setState({
        modalVisible: true
      });
    });
  }

  render() {
    const { modalVisible, filteredTunes, modalContents } = this.state;
    return (
      <View>
        <Modal
          style={styles.modal} // should these be in the AbstractModal instead?
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => {
            // would I actually want to do anything here?
          }}
        >
          {modalContents}
        </Modal>

        <View>
          <SearchContainer onSearch={this.onSearch} setSearchText={this.setSearchText} setKeyFilter={this.setKeyFilter} setRhythmFilter={this.setRhythmFilter} />
        </View>
        <FlatList
          contentContainerStyle={{ alignItems: 'flex-start' }}
          data={filteredTunes}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()} // is this really right
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginLeft: 10
  },
  listItemTitle: {
    fontSize: 20,
    textAlign: 'left',
    marginTop: 4,
    marginBottom: 4,
    marginRight: 10
  },
  listItemDetail: {
    fontSize: 13,
    textAlign: 'left',
    marginTop: 2,
    marginBottom: 2
  },
  modal: {
    margin: 20,
    borderRadius: 20,
    borderColor: 'black',
    borderWidth: 1
  }
});
