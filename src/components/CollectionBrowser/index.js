import { connect } from 'react-redux';
import CollectionBrowser from './CollectionBrowser';
import { fetchTune } from '../../redux/current-tune-slice';
import { applySearch, fetchSelectedCollection } from '../../redux/browser-slice';

function mapStateToProps(state) {
  const { selectedCollection, searchResults } = state.browser;
  return { selectedCollection, searchResults };
}

export default connect(mapStateToProps, { applySearch, fetchSelectedCollection, fetchTune })(CollectionBrowser);
