<template>
    <div>
        <li>TTT : {{todo.text}}</li>
    </div>
</template>

<script>
export default {
    name: 'todo-item',
    props:{
        todo:{
            type: Object,
            required: true
        }
    }
}
</script>

<style scoped>

</style>