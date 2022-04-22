'use strict';
import React,{Component} from 'react';
import {StyleSheet,Text,View,Image,TouchableHighlight,Animated} from 'react-native';

class Panel extends Component{
    constructor(props){
        super(props);

        this.icons = {
            'up'    : require('./images/Arrowhead-01-128.png'),
            'down'  : require('./images/Arrowhead-Down-01-128.png')
        };

        this.state = {
            title       : props.title,
            expanded    : false,
            animation   : new Animated.Value(0),
            minHeight   : 0,
            maxHeight   : 0,
            maxValueSet : false,
            minValueSet : false,
            cardHeight  : 'auto'
        };
    }

    toggle(){
        let initialValue    = this.state.expanded? this.state.maxHeight + this.state.minHeight : this.state.minHeight,
            finalValue      = this.state.expanded? this.state.minHeight : this.state.maxHeight + this.state.minHeight;

        this.setState((prevState) => ({
            expanded: !prevState.expanded
        }));

        Animated.spring(this.state.animation, {
            toValue: finalValue,
            useNativeDriver: true
        }).start();
    }

    _setMaxHeight(event){
        if(!this.state.maxValueSet) {
            this.setState({
                maxHeight   : event.nativeEvent.layout.height,
                maxValueSet : true
            });
        }
    }

    _setMinHeight(event){
        if(!this.state.minValueSet) {
            this.state.animation.setValue(event.nativeEvent.layout.height);

            this.setState({
                minHeight   : event.nativeEvent.layout.height,
                minValueSet : true
            });
        }
    }

    componentDidMount() {
        this.animationId = this.state.animation.addListener(({value}) => {
            this.setState({
                cardHeight: value
            });
        });
    }

    componentWillUnmount() {
        this.state.animation.removeListener(this.animationId);
    }

    render(){
        let icon = this.icons['down'];

        if(this.state.expanded){
            icon = this.icons['up'];
        }

        return (
            <Animated.View 
                style={[styles.container, {height: this.state.cardHeight}]}>
                <View style={styles.titleContainer} onLayout={this._setMinHeight.bind(this)}>
                    <Text style={styles.title}>{this.state.title}</Text>
                    <TouchableHighlight 
                        style={styles.button} 
                        onPress={this.toggle.bind(this)}
                        underlayColor="#f1f1f1">
                        <Image
                            style={styles.buttonImage}
                            source={icon}
                        ></Image>
                    </TouchableHighlight>
                </View>
                
                <View style={styles.body} onLayout={this._setMaxHeight.bind(this)}>
                    {this.props.children}
                </View>

            </Animated.View>
        );
    }
}

var styles = StyleSheet.create({
    container   : {
        backgroundColor: '#fff',
        margin:10,
        overflow:'hidden'
    },
    titleContainer : {
        flexDirection: 'row'
    },
    title       : {
        flex    : 1,
        padding : 10,
        color   :'#2a2f43',
        fontWeight:'bold'
    },
    button      : {

    },
    buttonImage : {
        width   : 30,
        height  : 25
    },
    body        : {
        padding     : 10,
        paddingTop  : 0
    }
});

export default Panel;