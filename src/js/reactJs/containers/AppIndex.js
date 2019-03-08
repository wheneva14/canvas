

import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import ReactTest from './components/ReactTest/index';

import basicFunc from "../global/functions/common";
import basic from '../setting/basic'

import axios from 'axios';
// const { fetchAPI } = basicFunc;
const { fetchAPI, axiosAPI } = basicFunc;



class AppIndex extends Component{
    constructor(props) {
        super(props);

        this.state = {
		};

		this.getAPI()
		console.log('constructor Index')
	}

	async getAPI(){
		// console.log(this.props)

		let _API = this.props.setting.APIs

		let result = await axiosAPI({src: _API.orderDetails})
		this.setState({
			apiSuccess: result.success
		})
	  
	}


		
    render(){
		if(!this.state.apiSuccess) return null;
        return(
			<div id="AppContainers">
				<ReactTest />
				
				<div>APP index</div>
				APISuccess: {this.state.apiSuccess.toString()}
			</div>
        )
    }
}

export default connect(z => z)(AppIndex);
