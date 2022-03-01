import React, { Component } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    ImageBackground,
    Image,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import jwtDecode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Perfil extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            role: '',
            email: '',
        };
    }

    buscarDadosPerfil = async () => {
        const valorToken = await AsyncStorage.getItem('userToken')

        if (valorToken != null) {
            this.setState({ email: jwtDecode(valorToken).email });
            this.setState({ username: jwtDecode(valorToken).username });
            this.setState({ role: jwtDecode(valorToken).role });
        }
    }

    tipoUsuario(role) {
        switch (role) {
            case 'ADM':
                return 'Administrador';
        
            case 'MED':
                return 'Médico';
            
            default:
                return 'Paciente'
        }
    }

    async componentDidMount() {
        this.buscarDadosPerfil()
    }

    render() {
        return (
            <View style={styles.Perfil}>
                
                <Image style={styles.perfilImg} source={require('../../assets/img/retrato-de-modo.png')} />

                <View style={styles.perfilInfo}>

                    <Text style={styles.username}>{this.state.username}</Text>
                    <Text style={styles.role}>{this.tipoUsuario(this.state.role)}</Text>
                    <View style={styles.emailBox}>
                        <Image source={require('../../assets/img/envelope.png')}style={styles.emailIcon}/>
                        <Text style={styles.email}>{this.state.email}</Text>
                    </View>

                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    Perfil: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#4DC0E0'
    },

    perfilInfo: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 200,
    },

    perfilImg: {
        width: 100,
        height: 100,
        marginTop: 40,
    },

    username: {
        color: '#FFFFFF',
        fontFamily: 'SourceCodePro-Bold',
        fontSize: 24,
        marginBottom: -5,
    },

    role: {
        color: '#FFFFFF',
        fontFamily: 'SourceCodePro-Regular',
        fontSize: 18,
    },
    
    email: {
        color: '#FFFFFF',
        fontFamily: 'SourceCodePro-Bold',
        fontSize: 16,
    },

    emailIcon: {
        width: 30,
        height: 30,
        marginRight: 10,
    },

    emailBox: {
        height: 100,
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
    }
});