import React, { Component } from 'react';
import { AsyncStorage, View, Image } from 'react-native';
import { Header, Icon } from 'react-native-elements'

class InAppHeader extends Component {
	// Homeボタン押下
	onPressHomeButton = () => {
		this.props.navigate('Home')
	}

	// ログアウトボタン押下
	onPressLogoutButton = () => {
		AsyncStorage.removeItem('groupInfo')
		this.props.navigate('LoginGroup')
	}

	render() {
		return (
			<View>
				<Header
					leftComponent={
						<View>
							<Icon
								name={'home'}
								type={'font-awesome'}
								color="#fff"
								onPress={() => this.onPressHomeButton()}
							/>
						</View>
					}
					centerComponent={
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'center',
								alignItems: 'center'
							}}
						>
							<Image source={require('./../../images/ComComCoin_logo_02.png')} />
						</View>
					}
					rightComponent={
						<View>
							<Icon
								name={'sign-out'}
								type={'font-awesome'}
								color="#fff"
								onPress={() => this.onPressLogoutButton()}
							/>
						</View>
					}
					backgroundColor="#ff5622"
				/>
			</View>
		)
	}
}

export default InAppHeader