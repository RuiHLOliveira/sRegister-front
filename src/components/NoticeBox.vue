<template>
    <div class="noticeBox" 
        :class="{ active: notice != '' }">
        <div class="noticeBoxContainer" :class="{
                'noticebox-error': noticeType == 'error',
                'noticebox-success': noticeType == 'success'
            }">
            <div class="noticeBox_closeButton" @click="close()">
                <i class="fas fa-times"></i>
            </div>
            {{notice}}
        </div>
    </div>
</template>

<script>

import EventBus from "../core/EventBus";

export default {
    name: "NoticeBox",
    data () {
        return {
            notice: '',
            noticeType: '',
        }
    },
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
        close() {
            this.notice = '';
            this.noticeType = '';
        }
    },
}
</script>

<style>
.noticeBox {
    display: none;
}

.noticeBox.active {
    position: absolute;
    top: 10px;
    right: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    animation: fadeInDown .3s;
    z-index: 10;
}

.noticeBoxContainer {
    position: relative;
    display: inline-block;
    width: 300px;
    padding: 20px;
    background-color: #ffffff;
    animation: fadeInDown .3s forwards;
    text-align: center;
    box-shadow: 0px 5px 5px rgba(0,0,0,.2);
    z-index: 10;
}

.noticeBox_closeButton {
    position: absolute;
    top: 2px;
    right: 10px;
    font-size: 1rem;
    cursor: pointer;
    color: #000000ff;
}

.noticeBox_closeButton:hover {
    color: #00000055;
}

.noticebox-error {
    background-color: #ff7777;
}
.noticebox-success {
    background-color:  #77cc77;
}

</style>