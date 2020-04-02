/**
 * Project: WebStorm
 * Date: 2020/4/2 4:30 下午
 * Author: caro
 * Description: react-native 单选组件
 * */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import {Icon} from 'native-base';

class SelectCom extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      SelectData: this.props.SelectData,//数据源
      visible: false,//控制model显示隐藏
      defaultValue: this.props.defaultValue || 0,//选中的元素
      showListData: '请选择',
    };
  }

  componentDidMount() {
    this.initSelectData();
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {defaultValue} = nextProps;
    if (this.props.defaultValue !== defaultValue) {
      this.setState({defaultValue: defaultValue}, () => {
        this.initSelectData();
      });
    }
    return true;
  }

  /*
  * 当组件接收到新的props时，会触发该函数。在该函数中，通常可以调用setState()来完成对state的修改。
  * */
  static getDerivedStateFromProps = (nxprops) => {
    return true;
  };

  /*
  * 检测一开始是否已选择
  * */
  checkIsSelect = (item) => {
    let isTrue = false;
    if (item.id == this.state.defaultValue) {
      isTrue = true;
    }
    return isTrue;
  };
  /*
  * 初始化一选择的数据
  * */
  initSelectData = async () => {
    await this.state.SelectData.map(async (item, index) => {
      item.isSelected = false;
      let isSelect = await this.checkIsSelect(item);
      if (isSelect) {
        item.isSelected = true;
      }
      return item;
    });
    await this.setState({
      SelectData: this.state.SelectData,
    });
    this.forceUpdate();

  };
  /*
  * 显示一选择的数据
  * */
  showListData = () => {
    let strArr = [];
    let str = '';
    this.state.SelectData.map((item, index) => {
      if (item.isSelected) {
        strArr.push(item.name);
      }
    });
    if (strArr.length > 0) {
      str = strArr.join(',');
    }
    if (str == '') {
      return (<Text style={[
          this.props.textStyle,
      {
        color: '#b4b4b4',
          textAlignVertical: 'center',
      ...Platform.select({
        ios: {lineHeight: this.props.textStyle.height || this.props.style.height || 36},
        android: {},
      }),
      },
      this.props.placeholderStyle,
    ]} numberOfLines={1}>{this.props.placeholder || '请选择'}</Text>);
    } else {
      return (<Text style={[styles.showText, this.props.textStyle, {
        textAlignVertical: 'center',
      ...Platform.select({
          ios: {lineHeight: this.props.textStyle.height || this.props.style.height || 36},
          android: {},
        }),
      }]} numberOfLines={1}>{str}</Text>);
    }
  };
  /*
  * 点击确定---关闭model---数据返回父组件
  * */
  makeSure = async () => {
    this.setState({
      visible: false,
    });
    await this.state.SelectData.map((item) => {
      if (item.isSelected) {
        this.state.defaultValue = item.id;
        this.props.chengeSelected(item.id, item);
        return;
      }
    });

  };
  /*
  * 取消之后将model关闭，数据清空
  * */
  closeSelectModel = () => {
    this.setState({
      visible: false,
      activeItemObj: {},
    });
    this.initSelectData();
  };
  /*
  * 点击选择 某一项
  * */
  selectAction = (index, item) => {
    let isTrue = item.isSelected;
    this.state.SelectData.map((item1) => {
      return item1.isSelected = false;
    });
    this.state.SelectData[index].isSelected = isTrue ? false : true;
    this.setState({
      SelectData: this.state.SelectData,
    });
  };
  /*
  * 显示选项
  * */
  _renderItem = (data) => {
    let {index, item} = data;
    let isSelectStyle = item.isSelected ? styles.isSelected : null;
    return (
      <TouchableOpacity onPress={() => {
      this.selectAction(index, item);
    }}>
  <View style={[styles.itemBox, isSelectStyle]}>
  <Text style={[styles.itemText]}>{item.name}</Text>
      </View>
      </TouchableOpacity>
  );
  };

  render() {
    return (
      <View>
      <TouchableOpacity style={[styles.showSelectedBtn, {...this.props.style}]}
    onPress={() => this.setState({visible: true})}>
  <View style={[styles.showSelected]}>
      {this.showListData()}
      <Icon style={[{color: '#a3a3a3', fontSize: 18, marginLeft: 5, marginRight: 5}]} fontSize={14}
    name='arrow-forward'/>
      </View>
      </TouchableOpacity>
      <Modal animationType={'slide'} transparent={true} visible={this.state.visible}>
      <View style={{backgroundColor: 'rgba(0,0,0,0.3)', width: '100%', height: '100%'}}>
  <View style={{width: '100%', height: '55%'}}></View>
    <View style={[styles.modelInnerBox]}>
      <View style={[styles.header]}>
      <Text style={[styles.titleText]}>{this.props.placeholder || '请选择'}</Text>
      <Icon name={'close'} style={styles.closeIcon} fontSize={18} onPress={() => {
      this.closeSelectModel();
    }}/>
    </View>
    <FlatList style={{height: '100%', marginTop: 8}}
    data={this.state.SelectData}
    extraData={this.state}
    keyExtractor={(item, index) => index.toString()}
    renderItem={this._renderItem}
    />
    <View style={styles.footer}>
      <TouchableOpacity onPress={() => {
      this.makeSure();
    }}>
  <Text style={styles.selectBtn}>确定</Text>
      </TouchableOpacity>
      </View>
      </View>
      </View>
      </Modal>
      </View>
  );
  }
}

SelectCom.defaultProps = {
  textStyle: {
    height: 36,
  },
  placeholder: '请选择',
  placeholderStyle: '#b4b4b4',
};

export default SelectCom;

const styles = StyleSheet.create({
  modelInnerBox: {
    width: '100%',
    backgroundColor: 'white',
    height: '45%',
    borderTopStartRadius: 15,
    borderTopEndRadius: 15,
    paddingLeft: 10,
    paddingRight: 10,
  },
  header: {
    position: 'relative',
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 7,
    alignItems: 'center',
    borderTopStartRadius: 15,
    borderTopEndRadius: 15,
    borderBottomColor: '#00887A',
    borderBottomWidth: 1,
  },
  titleText: {
    width: '100%',
    color: '#111111',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 5,
  },
  closeIcon: {
    position: 'absolute',
    top: 5,
    right: 10,
  },
  footer: {
    paddingBottom: 15,
  },
  showSelectedBtn: {
    backgroundColor: '#fff',
    height: '100%',
  },
  showSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    height: '100%',
  },
  showText: {
    width: '100%',
    height: '100%',
    textAlign: 'right',
    color: '#292929',
    fontSize: 16,
  },
  selectBtn: {
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#00887A',
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
  },
  itemBox: {
    width: '100%',
    paddingTop: 10,
    paddingBottom: 10,
  },
  itemText: {
    fontSize: 20,
    textAlign: 'center',
  },
  isSelected: {
    backgroundColor: '#e8e8e8',
  },

});
