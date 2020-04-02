# react-native 单项选择组件

### 实例
    let options = [{id: 1, name: 'test1'}];
    
    ...
    
    <SelectCom
        chengeSelected={(val, data) => {
          console.log(val, data);
        }}
        SelectData={
          options
        }
        defaultValue={1}
        placeholder={'请选择'}
      />
