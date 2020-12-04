export default {
    data: function () {
      return {
            userName: 'man'
        }
    },
    computed: {
    },
    methods: {
    },
    template: `
    <div class="flexWrapper">
        <application-menu v-on:action="$emit('action',$event)"></application-menu>
        <div class="container">
            Welcome, {{userName}}
        </div>
    </div>
    `
};