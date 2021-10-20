import React, { useState } from "react";
import { View, StatusBar, FlatList } from "react-native";
import styled from "styled-components";
import AddInput from "./components/AddInput";
import TodoList from "./components/TodoList";
import Empty from "./components/Empty";
import Header from "./components/Header";
import firestore from '@react-native-firebase/firestore';

export default function App() {
  const [data, setData] = useState([]);

  async function handleSend(messages, wantee) {
    const text = messages;
    const date = wantee;

    firestore()
      .collection('THREADS')
      .add({
        text,
        date,
        createdAt: new Date().getTime()
      });

    await firestore()
      .collection('THREADS')
      .set(
        {
          text,
          date,
          createdAt: new Date().getTime()
        },
        { merge: true }
      );
  }

  const submitHandler = (value, date) => {
    setData((prevTodo) => {

      const realdate = date.getDate() + "-" + parseInt(date.getMonth() + 1) + "-" + parseInt(date.getFullYear() + 543);

      handleSend(value, realdate);

      return [
        {
          value: value,
          date: realdate,
          key: Math.random().toString(),
        },
        ...prevTodo,
      ];
    });
  };

  const deleteItem = (key) => {
    setData((prevTodo) => {
      return prevTodo.filter((todo) => todo.key != key);
    });
  };

  const searchItem = (keyword) => {

  }

  return (
    <ComponentContainer>
      <View>
        <StatusBar barStyle="light-content" backgroundColor="#449C1A" />
      </View>
      <View>
        <FlatList
          data={data}
          ListHeaderComponent={() => <Header searchItem={searchItem} />}
          ListEmptyComponent={() => <Empty />}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <TodoList item={item} deleteItem={deleteItem} />
          )}
        />
        <View>
          <AddInput submitHandler={submitHandler} />
        </View>
      </View>
    </ComponentContainer>
  );
}

const ComponentContainer = styled.View`
  background-color: #449C1A;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;