import React from 'react';
import { 
    View, 
    Text, 
    Button, 
    TouchableOpacity, 
    Dimensions,
    TextInput,
    Platform,
    StyleSheet,
    ScrollView,
    StatusBar
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

import { Axios } from '../boot'
import Api from '../services/api';
const api = new Api('Coin');
import _ from 'lodash'

import { AuthContext } from '../components/context';

const SignInScreen = ({navigation}) => {

    const [data, setData] = React.useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirm_password: '',
        check_firstNameChange: false,
        check_lastNameChange: false,
        check_emailChange: false,
        secureTextEntry: true,
        confirm_secureTextEntry: true,
    });

    const { signUp } = React.useContext(AuthContext);

    const signUpHandle = () => {
      const fd = new FormData()
      fd.append('first_name', data.first_name)
      fd.append('last_name', data.last_name)
      fd.append('email', data.email)
      fd.append('password', data.password)
      // fd.append('avatar', this.state.singleFile)
      api.call('registration', fd)
        .then(({ data }) => {
          // signUp()
          navigation.navigate('SignInScreen')
        })
        .catch(error => {
          console.log(error)
        })
        .finally(() => {
          //
        })
    }

    const firstNameChange = (val) => {
        if( val.length !== 0 ) {
            setData({
                ...data,
                first_name: val,
                check_firstNameChange: true
            });
        } else {
            setData({
                ...data,
                first_name: val,
                check_firstNameChange: false
            });
        }
    }

    const lastNameChange = (val) => {
      if( val.length !== 0 ) {
          setData({
              ...data,
              last_name: val,
              check_lastNameChange: true
          });
      } else {
          setData({
              ...data,
              last_name: val,
              check_lastNameChange: false
          });
      }
  }

  const everythingIsFull = () => {
    if (data.first_name &&
        data.last_name &&
        data.email &&
        data.password &&
        data.confirm_password &&
        data.password === data.confirm_password) {
      return true
    } else {
      return false
    }
    data.first_name && data.last_name && data.email && data.password && data.confirm_password && data.password === data.confirm_password
  }

  const emailChange = (val) => {
    if( val.length !== 0 ) {
        setData({
            ...data,
            email: val,
            check_emailChange: true
        });
    } else {
        setData({
            ...data,
            email: val,
            check_emailChange: false
        });
    }
}

    const handlePasswordChange = (val) => {
        setData({
            ...data,
            password: val
        });
    }

    const handleConfirmPasswordChange = (val) => {
        setData({
            ...data,
            confirm_password: val
        });
    }

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    const updateConfirmSecureTextEntry = () => {
        setData({
            ...data,
            confirm_secureTextEntry: !data.confirm_secureTextEntry
        });
    }

    return (
      <View style={styles.container}>
          <StatusBar backgroundColor='#009387' barStyle="light-content"/>
        <View style={styles.header}>
            <Text style={styles.text_header}>Зарегистрируйся сейчас!</Text>
        </View>
        <Animatable.View 
            animation="fadeInUpBig"
            style={styles.footer}
        >
          <ScrollView>
            <Text style={styles.text_footer}>Имя</Text>
            <View style={styles.action}>
                <FontAwesome 
                  name="user-o"
                  color="#05375a"
                  size={20}
                />
                <TextInput 
                  placeholder="Введите имя"
                  style={styles.textInput}
                  autoCapitalize="none"
                  onChangeText={(val) => firstNameChange(val)}
                />
                {data.check_firstNameChange ? 
                <Animatable.View
                    animation="bounceIn"
                >
                  <Feather 
                    name="check-circle"
                    color="green"
                    size={20}
                  />
                </Animatable.View>
                : null}
            </View>

            <Text style={[styles.text_footer, {
                marginTop: 35
            }]}>Фамилия</Text>
            <View style={styles.action}>
                <FontAwesome 
                  name="user-o"
                  color="#05375a"
                  size={20}
                />
                <TextInput 
                  placeholder="Введите фамилию"
                  style={styles.textInput}
                  autoCapitalize="none"
                  onChangeText={(val) => lastNameChange(val)}
                />
                {data.check_lastNameChange ? 
                <Animatable.View
                    animation="bounceIn"
                >
                  <Feather 
                    name="check-circle"
                    color="green"
                    size={20}
                  />
                </Animatable.View>
                : null}
            </View>

            <Text style={[styles.text_footer, {
                marginTop: 35
            }]}>Электронная почта</Text>
            <View style={styles.action}>
                <Feather 
                  name="mail"
                  color="#05375a"
                  size={20}
                />
                <TextInput 
                  placeholder="Введите электронную почту"
                  style={styles.textInput}
                  autoCapitalize="none"
                  onChangeText={(val) => emailChange(val)}
                  keyboardType='email-address'
                />
                {data.check_emailChange ? 
                <Animatable.View
                    animation="bounceIn"
                >
                  <Feather 
                    name="check-circle"
                    color="green"
                    size={20}
                  />
                </Animatable.View>
                : null}
            </View>

            <Text style={[styles.text_footer, {
                marginTop: 35
            }]}>Пароль</Text>
            <View style={styles.action}>
                <Feather 
                    name="lock"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Введите пароль"
                    secureTextEntry={data.secureTextEntry ? true : false}
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => handlePasswordChange(val)}
                />
                <TouchableOpacity
                    onPress={updateSecureTextEntry}
                >
                    {data.secureTextEntry ? 
                    <Feather 
                        name="eye-off"
                        color="grey"
                        size={20}
                    />
                    :
                    <Feather 
                        name="eye"
                        color="grey"
                        size={20}
                    />
                    }
                </TouchableOpacity>
            </View>

            <Text style={[styles.text_footer, {
                marginTop: 35
            }]}>Подтверждение пароля</Text>
            <View style={styles.action}>
                <Feather 
                    name="lock"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Подтвердите пароль"
                    secureTextEntry={data.confirm_secureTextEntry ? true : false}
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => handleConfirmPasswordChange(val)}
                />
                <TouchableOpacity
                    onPress={updateConfirmSecureTextEntry}
                >
                    {data.secureTextEntry ? 
                    <Feather 
                        name="eye-off"
                        color="grey"
                        size={20}
                    />
                    :
                    <Feather 
                        name="eye"
                        color="grey"
                        size={20}
                    />
                    }
                </TouchableOpacity>
            </View>
            <View style={styles.textPrivate}>
                <Text style={styles.color_textPrivate}>
                  Регистрируясь, вы соглашаетесь с нашими
                  <Text style={[styles.color_textPrivate, {fontWeight: 'bold'}]}>{" "}Условиями</Text>
                  <Text style={styles.color_textPrivate}>{" "}и</Text>
                  <Text style={[styles.color_textPrivate, {fontWeight: 'bold'}]}>{" "}Политикой конфиденциальности</Text>
                </Text>
                
                
                
            </View>
            <View style={styles.button}>
                <TouchableOpacity
                    style={styles.signIn}
                    onPress={() => signUpHandle()}
                >
                <LinearGradient
                    colors={
                      everythingIsFull() ?
                      ['#2787f5', '#2787b5'] :
                      ['grey', 'grey']
                    }
                    style={styles.signIn}
                >
                    <Text style={[styles.textSign, {
                        color:'#fff'
                    }]}>Зарегистрироваться</Text>
                </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={[styles.signIn, {
                        borderColor: '#009387',
                        borderWidth: 1,
                        marginTop: 15
                    }]}
                >
                    <Text style={[styles.textSign, {
                        color: '#009387'
                    }]}>Войти</Text>
                </TouchableOpacity>
            </View>
          </ScrollView>
        </Animatable.View>
      </View>
    );
};

export default SignInScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor: '#2787f5'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: Platform.OS === 'ios' ? 3 : 5,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    textPrivate: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20
    },
    color_textPrivate: {
        color: 'grey'
    }
  });