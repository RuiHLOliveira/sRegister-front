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
        EventBus.$on('NOTICEBOX_NOTICE', (data) => {
            this.showNotice(data.notice, data.noticeType, data.time);
        });
    },
    methods: {
        showNotice(notice, noticeType, time){
            if(time == null) time = 5000;
            let vue = this;
            vue.notice = notice;
            vue.noticeType = noticeType;
            setTimeout(function () {
                vue.notice = '';
                vue.noticeType = '';
            }, time);
        },
    },
    template: `
    <div class="noticeBox" 
        :class="{ ativo: notice != '' }">
        <div class="noticeBoxContainer" :class="{
                error: noticeType == 'error',
                success: noticeType == 'success'
            }">{{notice}}</div>
    </div>
    `,

};