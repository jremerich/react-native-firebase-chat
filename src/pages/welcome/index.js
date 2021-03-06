import React, { Component } from 'react';
import Geolocation from 'react-native-geolocation-service';
import Permissions from 'react-native-permissions';
import { NetworkInfo } from 'react-native-network-info';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
} from 'react-native';

import styles from './styles';

export default class Welcome extends Component {
    static navigationOptions = {
        header: null,
    };

    state = {
        position: {},
        wifi: {},
    };

    componentDidMount() {
        this.setState({ position: 'iniciando busca...' });
        this.gpsInit();

        console.tron.log('NetworkInfo: ', NetworkInfo);
    }

    getWifiInfo = async () => {
        NetworkInfo.getSSID((ssid) => {
            console.tron.log('ssid: ', ssid);
            let { wifi } = this.state;
            if (ssid !== '0x') {
                wifi.ssid = ssid;
                NetworkInfo.getBSSID((bssid) => {
                    console.tron.log('bssid: ', bssid);
                    wifi.bssid = bssid;
                    this.setState({ wifi });
                });
            } else {
                wifi = {};
            }
            this.setState({ wifi });
        });
    }

    gpsInit = async () => {
        console.tron.log('gpsInit');
        Permissions.request('location').then((response) => {
            if (response === 'authorized') {
                console.tron.log('buscando gps');
                Geolocation.watchPosition((position) => {
                    this.setState({ position });
                    console.tron.log(position);

                    this.getWifiInfo();
                }, (error) => {
                    // See error code charts below.
                    console.tron.log(error.code, error.message);
                }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, distanceFilter: 50 });
            } else {
                console.tron.log('GPS permission denied');
            }
        }).catch((err) => {
            console.log('err :', err);
        });
    };

    render() {
        const { wifi, position } = this.state;
        return (
            <View style={styles.container}>
                <Text style={styles.title}>
                    Bem vindo!
                </Text>
                <Text style={styles.text}>
                    Entre com o apelido que desejar!!!!
                </Text>

                <View style={styles.form}>
                    <TextInput
                        style={styles.input}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Apelido"
                        underlineColorAndroid="rgba(0, 0, 0, 0)"
                    />

                    <TouchableOpacity style={styles.button} onPress={() => {}}>
                        <Text style={styles.buttonText}>
                            Entrar
                        </Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.text}>
                    {(position.coords) ? `${position.coords.latitude}, ${position.coords.longitude}` : 'buscando gps...'}
                </Text>

                <Text style={styles.text}>
                    {JSON.stringify(wifi)}
                </Text>
            </View>
        );
    }
}
