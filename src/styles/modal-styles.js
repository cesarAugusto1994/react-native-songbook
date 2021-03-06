import { StyleSheet } from 'react-native';
import Fonts from './fonts';
import Colors from './colors';

export default StyleSheet.create({
  modalContainer: {
    flex: 1
  },
  modalScrollContainer: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  modalHeader: {
    alignItems: 'center'
  },
  modalBody: {
    alignItems: 'flex-start',
    paddingBottom: 30,
  },
  modalFooter: {
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 80,
    paddingLeft: 20,
    paddingRight: 20,
  },
  modalButton: {
    marginBottom: 40,
    width: 130,
    borderWidth: 1.5,
    borderColor: Colors.modalButtonBorder,
  },
  title: {
    fontSize: 22,
    fontFamily: Fonts.default,
    textAlign: 'center',
    margin: 15,
    textDecorationLine: 'underline',
  },
  message: {
    fontSize: 20,
    fontFamily: Fonts.default,
    marginTop: 20,
    marginBottom: 15,
  },
  infoItem: {
    fontSize: 14,
    fontFamily: Fonts.info,
    padding: 10,
    width: '100%',
  },
  // height should be the same as height for the button? what determines the height of the button?
  fileInfoItem: {
    width: '68%',
    backgroundColor: Colors.fileInfoBackground,
    paddingTop: 11,
    paddingBottom: 9,
    paddingLeft: 12,
    fontFamily: Fonts.info,
    height: 41
  },
  pickerContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    minHeight: 45,
    backgroundColor: Colors.pickerBackground,
    borderRadius: 6
  },
  // setting an arbitrarily large number allows 100% width, but it hides the little black arrow.
  // but it won't accept '100%' in this case for some reason so have to do this
  // should change to use alignSelf stretch and flex??
  modalPicker: {
    width: 999999,
    height: 45
  }
});
