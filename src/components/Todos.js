import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, ScrollView, FlatList} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {Appbar, TextInput, Button} from 'react-native-paper';
import Todo from './Todo'

const Todos = () => {
  const ref = firestore().collection('todos');
  const [todo, setTodo] = useState('');
  const [loading, setLoading]=useState(true)
  const [todos, setTodos] = useState([])

  async function addTodo() {
    if (todo != '') {
      await ref.add({
        title: todo,
        complete: false,
      });
      setTodo('');
    }
  }

  useEffect(()=>{
      return ref.onSnapshot((querySnapshot)=>{
        const list = [];
        querySnapshot.forEach(doc => {
          const { title, complete } = doc.data();
          list.push({
            id: doc.id,
            title,
            complete,
          });
        });
  
        setTodos(list);
  
        if (loading) {
          setLoading(false);
        }
      })
  },[])

  if (loading){
      return null
  }

  return (
    <>
      <Appbar>
        <Appbar.Content title={'TODOs List'} />
      </Appbar>
        <FlatList
            style={{flex:1}}
            data={todos}
            keyExtractor={(item)=>(item.id)}
            renderItem={({item})=><Todo {...item}/>}
        />
      <TextInput value={todo} label={'New Todo'} onChangeText={setTodo} />
      <Button onPress={() => addTodo()}>Add TODO</Button>
    </>
  );
};

export default Todos;

const styles = StyleSheet.create({});
