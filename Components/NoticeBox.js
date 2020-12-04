import EventBus from "./../app/EventBus.js";
export default {
    data: function () {
        return {
            notice: '',
            noticeType: '',
        }
    },
    // props: ['notice', 'noticeType'],
    computed: {
    },
    created () {
        EventBus.$on('notice', (data) => {
            this.showNotice(data.notice, data.noticeType, data.time);
        });
    },
    methods: {
        showNotice(notice, noticeType, time){
            let vue = this;
            vue.notice = notice;
            vue.noticeType = noticeType;
            setTimeout(function () {
                vue.notice = '';
                vue.noticeType = '';
            }, time);
        }
    },
    template: `
    <div class="noticeBoxContainer" 
        :class="{ ativo: notice != '' }">
        <div class="noticeBox" :class="{
                error: noticeType == 'error',
                success: noticeType == 'success'
            }">{{notice}}</div>
    </div>
    `
};