import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const useUserStore = defineStore('user', () => {
    let userList = reactive([
        {
            num: 220812022,
            userName: '刘淑文',
            age: 18,
        },
        {
            num: 220812008,
            userName: '蔡欣怡',
            age: 18,
        },
        {
            num: 220812030,
            userName: '龙依',
            age: 18,
        },
    ]);

    const setUserList = (newList) => {
        userList = newList;
    };

    return {
        userList,
        setUserList,
    };
});
