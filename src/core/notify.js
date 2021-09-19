import EventBus from "./EventBus";
export default {
    notify(notice, noticeType, time = null){
        EventBus.$emit('NOTICEBOX_NOTICE', {
            'notice': notice,
            'noticeType': noticeType,
            'time': time
        });
    }
};