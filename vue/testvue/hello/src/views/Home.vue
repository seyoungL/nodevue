<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">

    <input type="text" v-model="msg">
    <span v-html="msg"></span>

    <button :disabled="isButtonDisabled" @click="isButtonDisabled = !isButtonDisabled">disabled Button</button>

<div>
    <a href="#" @click.prevent="aaa()">aaaa
      <span @click.stop="bbb()">bbbb</span>
    </a>
</div>

    <todo-item v-for="item in groceryList"
              v-bind:todo="item"
              v-bind:key="item.id">
    </todo-item>

    <todo-item v-bind:todo="groceryList[0]"></todo-item>
    <todo-item v-bind:todo="{id:9999,text:'99999'}"></todo-item>
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import TodoItem from '@/components/todo-item.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld,
    TodoItem
  },
  methods: {
    aaa(){
      console.log('----aaa-----');
    },
    bbb(){
      console.log('---bbbb----');  
    }
  },
  data(){
    return{
      msg: '<strong>AAA</strong>',
      isButtonDisabled: false,
      groceryList: [
        {id: 0, text: 'vegetables'},
        {id: 1, text: 'Cheese'},
        {id: 2, text: 'Whatever'}
      ]
    }
  }
}
</script>
