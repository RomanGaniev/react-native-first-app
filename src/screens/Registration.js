import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import PostsList from '../components/PostsList';
import Api from '../services/api';
const api = new Api('Coin');
import _ from 'lodash';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

export class Registration extends Component {

  constructor(props) {
    super(props);
    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      singleFile: null
    };
  }

  uploadImage = async () => {
    // Check if any file is selected or not
    if (this.state.singleFile != null) {
      // If file selected then create FormData
      const fileToUpload = this.state.singleFile;
      const data = new FormData();
      data.append('name', 'Image Upload');
      data.append('file_attachment', fileToUpload);
      // Please change file upload URL
      // let res = await fetch(
      //   'http://localhost/upload.php',
      //   {
      //     method: 'post',
      //     body: data,
      //     headers: {
      //       'Content-Type': 'multipart/form-data; ',
      //     },
      //   }
      // );
      // let responseJson = await res.json();
      const responseJson = {
        status: 1
      };
      if (responseJson.status == 1) {
        alert('Upload Successful');
      }
    } else {
      // If no file selected the show alert
      alert('Please Select File first');
    }
  }

  selectFile = async () => {
    // Opening Document Picker to select one file
    try {
      const res = await DocumentPicker.getDocumentAsync({
        // Provide which type of file you want user to pick
        type: '*/*',
        copyToCacheDirectory: false
        // There can me more options as well
        // DocumentPicker.types.allFiles
        // DocumentPicker.types.images
        // DocumentPicker.types.plainText
        // DocumentPicker.types.audio
        // DocumentPicker.types.pdf
      });
      const split = res.uri.split('/');
      const name = split.pop();
      const inbox = split.pop();
      const realPath = `${FileSystem.cacheDirectory}${inbox}/${name}`;
      console.log('split: ', split, 'name: ', name, 'inbox: ', inbox, 'realPath: ', realPath);
      // Printing the log realted to the file
      // console.log('res : ' + JSON.stringify(res));
      // Setting the state to show single file attributes
      this.setState({
        singleFile: res
      });
      // setSingleFile(res);
    } catch (err) {
      this.setState({
        singleFile: null
      });
      // setSingleFile(null);
      // Handling any exception (If any)
      // if (DocumentPicker.isCancel(err)) {
      //   // If user canceled the document selection
      //   alert('Canceled');
      // } else {
      //   // For Unknown Error
      //   alert('Unknown Error: ' + JSON.stringify(err));
      //   throw err;
      // }
    }
  }

  onChangeFirstName(e) {
    this.setState({
      first_name: e
    });
  }
  onChangeLastName(e) {
    this.setState({
      last_name: e
    });
  }
  onChangeEmail(e) {
    this.setState({
      email: e
    });
  }
  onChangePassword(e) {
    this.setState({
      password: e
    });
  }

  register() {
    const fd = new FormData()
    fd.append('first_name', this.state.first_name)
    fd.append('last_name', this.state.last_name)
    fd.append('email', this.state.email)
    fd.append('password', this.state.password)
    // fd.append('avatar', this.state.singleFile)
    api.call('registration', fd)
      .then(({ data }) => {
        alert(data);
        // this.save(data.access_token)
        // this.props.navigation.navigate('Auth')
        // this.setState(prev => ({
        //   posts: data.data
        // }));
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
        //
      })
  }

  render() {
    return (
      <View style={styles.container}>
        
        <Text style={{fontSize: 16, fontWeight: '600', marginBottom: 5, marginTop: 7}}>Имя</Text>
        <TextInput
          placeholder='Введите имя'
          style={styles.input}
          onChangeText={e => {
            this.onChangeFirstName(e);
          }}
          value={this.state.name}
        />
        <Text style={{fontSize: 16, fontWeight: '600', marginBottom: 5, marginTop: 7}}>Фамилия</Text>
        <TextInput
          placeholder='Введите фамилию'
          style={styles.input}
          onChangeText={e => {
            this.onChangeLastName(e);
          }}
          value={this.state.name}
        />
        <Text style={{fontSize: 16, fontWeight: '600', marginBottom: 5}}>Электронный адрес</Text>
        <TextInput
          placeholder='Введите электронную почту'
          style={styles.input}
          onChangeText={e => {
            this.onChangeEmail(e);
          }}
          value={this.state.email}
          keyboardType='email-address'
        />
        <Text style={{fontSize: 16, fontWeight: '600', marginBottom: 5}}>Пароль</Text>
        <TextInput
          placeholder='Придумайте пароль'
          style={styles.input}
          onChangeText={e => {
            this.onChangePassword(e);
          }}
          value={this.state.password}
        />
        <Button title='Зарегистрироваться' onPress={() => this.register()}></Button>
        {this.state.singleFile != null ? (
        <Text style={styles.textStyle}>
          File Name: {this.state.singleFile.name ? this.state.singleFile.name : ''}
          {'\n'}
          Type: {this.state.singleFile.type ? this.state.singleFile.type : ''}
          {'\n'}
          File Size: {this.state.singleFile.size ? this.state.singleFile.size : ''}
          {'\n'}
          URI: {this.state.singleFile.uri ? this.state.singleFile.uri : ''}
          {'\n'}
        </Text>
      ) : null}
        <Button title='Добавить фото профиля' onPress={() => this.selectFile()}></Button>
        
        <View style={{flexDirection: 'row', alignItems: 'flex-end', flexGrow: 1, flex: 1, justifyContent: 'center'}}>
          <View style={{alignItems: 'center'}}>
            <Text style={{fontSize: 18, color: 'grey'}}>Есть аккаунт?</Text>
            <Button title='К авторизации' onPress={() => this.props.navigation.navigate('Auth')}></Button>
          </View>
        </View>
        {/* <Button
          title="Go to Details"
          onPress={() => this.props.navigation.navigate('Posts')}
        /> */}
      </View>
    );
  }
}

export default Registration;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: '',
    backgroundColor: 'white',
    padding: 10
  },
  input: {
    paddingHorizontal: 10,
    height: 45,
    borderColor: 'black',
    borderWidth: 1.5,
    borderRadius: 5,
    marginBottom: 15
  },
  textStyle: {
    backgroundColor: '#fff',
    fontSize: 15,
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
    textAlign: 'center',
  }
})