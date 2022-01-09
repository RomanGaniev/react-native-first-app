import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native'

export const EmailEntry = ({ email, setEmail, goTo }) => {

  const emailIsValid = email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<View style={styles.container}>
				<View style={{flex: 1}}>
					<Text style={styles.textHeader}>
            Введите email
          </Text>
					<Text style={styles.subtitle}>
            Ваш email будет использоваться для входа в аккаунт
          </Text>
					<TextInput
						placeholder='Email'
						placeholderTextColor='#7c7c7c'
						style={styles.input}
						onChangeText={(val) => {
							setEmail(val)
						}}
						value={email}
						keyboardType='email-address'
						autoFocus={true}
						autoCapitalize="none"
            clearButtonMode='while-editing'
					/>
					<TouchableOpacity
						disabled={!email || !emailIsValid}
						style={email && emailIsValid ?
                styles.nextButtonActive
              :
                styles.nextButtonInactive
            }
						onPress={goTo}
					>
						<Text style={styles.textNextButton}>Далее</Text>
					</TouchableOpacity>
				</View>
				<Text style={styles.textAgreement}>
          {'Нажимая «Далее», вы принимаете '}
					<Text style={styles.underlineText}>
            Условия использования
          </Text>
					<Text>{' и '}</Text>
					<Text style={styles.underlineText}>
            Политику конфиденциальности
          </Text>
					<Text>{' сервиса'}</Text>
				</Text>
			</View>
		</TouchableWithoutFeedback>
	)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25
  },
  input: {
    paddingHorizontal: 12,
    height: 45,
    borderColor: '#b8b8b8',
    borderWidth: 0.5,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: '#ededed',
    marginBottom: 20
  },
  nextButtonActive: {
    flexDirection: 'row',
    backgroundColor: '#2887f5',
    borderRadius: 10,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    textAlignVertical: 'center',
    marginBottom: 20
  },
  nextButtonInactive: {
    flexDirection: 'row',
    backgroundColor: '#98b6db',
    borderRadius: 10,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    textAlignVertical: 'center',
    marginBottom: 20
  },
  textNextButton: {
    color: 'white',
    fontWeight: '500',
    fontSize: 18
  },
  textHeader: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 15,
    color: '#7c7c7c',
    marginBottom: 25
  },
  textAgreement: {
    textAlign: 'center',
    fontSize: 13,
    color: '#7c7c7c',
    marginBottom: 25
  },
  underlineText: {
    textDecorationLine: 'underline'
  }
})