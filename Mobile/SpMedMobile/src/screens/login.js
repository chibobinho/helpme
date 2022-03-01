import React, { Component } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    Image,
    ImageBackground,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import api from '../services/api';

import AsyncStorage from '@react-native-async-storage/async-storage';


export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: 'aymbere.ponzetto@conexaodigital.com',
            senha: '100',
        };
    }

    realizarLogin = async () => {
        try {
            const resposta = await api.post('/login', {
                email: this.state.email,
                senha: this.state.senha,
            });

            const token = resposta.data.token;
            await AsyncStorage.setItem('userToken', token);

            if (resposta.status == 200) {
                this.props.navigation.navigate('Main');
                console.warn('Login efetuado com sucesso!');
            }
        } catch {
            console.warn('Usuário ou senha incorretos.')
        }
    };

    render() {
        return (
            <View style={styles.Login}
            >
                <Image style={styles.ImagemLogin} source={require('../../assets/img/Imagem_centro.png')} />
                <TextInput
                    style={styles.inputLogin}
                    placeholder="username"
                    placeholderTextColor="#FFF"
                    keyboardType="email-address"
                    onChangeText={email => this.setState({ email })}
                    value={this.state.email}
                />

                <TextInput
                    style={styles.inputLogin}
                    placeholder="******"
                    placeholderTextColor="#FFF"
                    keyboardType="default"
                    secureTextEntry={true}
                    onChangeText={senha => this.setState({ senha })}
                    value={this.state.senha}
                />

                <TouchableOpacity
                    style={styles.btnLogin}
                    onPress={this.realizarLogin}>
                    <Text style={styles.btnLoginText}>Login</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    

    Login: {
        flex: 1,
        padding: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4DC0E0'
    },

    inputLogin: {
        width: 241,
        paddingTop: 50,
        fontFamily: 'Roboto-mono',
        fontSize: 24,
        color: '#FFFFFF',
        borderStyle: 'solid',
        borderBottomWidth: 3,
        borderColor: '#FFFFFF',
        borderBottomColor: '#FFFFFF'
    },

    btnLogin: {
        borderColor: '#FFFFFF',
        borderWidth: 3,
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        width: 241,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 56,
    },

    btnLoginText: {
        fontFamily: 'Roboto-mono',
        fontSize: 24,
        color: '#4DC0E0',
    }
});