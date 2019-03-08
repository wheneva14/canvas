import React, { Component, Fragment } from "react";



export default class ReactTest extends Component{
    constructor(props) {
        super(props);

        this.state = {
        };

    }

    clickToShow(){
		global.loader.show()
    }
    
    clickToShowExtends(){
		global.loaderExtend.show()
	}

    render(){
        return(
            <div>
                <div>i am react test</div>
                <div onClick={this.clickToShow.bind(this)}>click show</div>

                <div onClick={this.clickToShowExtends.bind(this)}>click show extends</div>
            </div>
            
        )
    }
}