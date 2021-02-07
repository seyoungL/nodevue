<template>
  <div class="home">
    <ul>
      <li v-for="reply in replies">
        {{reply.rno}}. <input type="text" v-model="reply.replytext">
        <button @click.prevent="saveReply(reply)">Save</button>
      </li>
    </ul>
    <img alt="Vue logo" src="../assets/logo.png">

    <input type="text" v-model="msg">
    <span v-html="msg"></span> <span class="red">{{reversedMessage}}</span>

    <button :disabled="isButtonDisabled" @click="isButtonDisabled = !isButtonDisabled">disabled Button</button>

    <div>
        <a href="#" @click.prevent="aaa()">aaaa
          <span @click.stop="bbb()">bbbb</span>
        </a>
    </div>

    <div :class="{red:isButtonDisabled}">REDDDDD</div>
    <div :class="[activeClass, errorClass]"></div>

    <todo-item v-for="item in groceryList"
              v-bind:todo="item"
              v-bind:key="item.id">
    </todo-item>

    <todo-item v-bind:todo="groceryList[0]"></todo-item>
    <todo-item v-bind:todo="{id:9999,text:'99999'}"></todo-item>
    <HelloWorld v-if="isButtonDisabled" msg="Welcome to Your Vue.js App"/>
    <div v-else>Nooo</div>
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

  created(){
    this.fetchReplies();
  },

  computed: {
    reversedMessage: function(){
      return this.msg.split('').reverse().join('')
    },
    evenNumber: function(){
      return this.numbers.filter(function (number){
        return number %2 == 0
      })
    }
  }, 

  watch: {
    msg: function(){
      console.log('----', this.msg);
    }
  },

  methods: {
    aaa(){
      console.log('----aaa-----');
    }, 
    bbb(){
      console.log('---bbbb----');  
    },
    fetchReplies(){
      this.$https.get('http://localhost:7000/apis/replies/265').then( ret => {
        if(ret.status != 200) return [];
        
        this.replies = ret.data;
      })
    },
    saveReply(reply){
       this.$https.put('http://localhost:7000/apis/replies/265', reply.rno).then( ret=>{
         if(ret.status != 200) return [];

         alert(ret.data + '개의 댓글이 수정되었습니다.');
       });
    }
  },
  data(){
    return{
      replies: [],
      activeClass: 'active',
      errorClass: 'text-danger',
      msg: 'abcd',
      isButtonDisabled: false,
      groceryList: [
        {id: 0, text: 'vegetables'},
        {id: 1, text: 'Cheese'},
        {id: 2, text: 'Whatever'}
      ],
      numbers: [1,2,3,4,5]
    }
  }
}
</script>

<style>
  .red {color:red}
</style>