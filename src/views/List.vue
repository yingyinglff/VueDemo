<template>
    <!-- 列表 -->
    <div>
        <div class="text-3xl text-center h-16 leading-loose">同学列表</div>
        <div class="flex justify-end mb-2">
            <!-- <button class="text-white w-20 mr-10 h-10 bg-gray-700" type="primary" @click="addUser">新 增</button> -->
            <a-button type="primary" @click="addUser" class="mr-20" :disabled="disabled">新增</a-button>
        </div>
        <!-- <ul class="text-center px-10">
            <li class="list-none flex justify-start items-center h-16 text-white bg-gray-500">
                <span class="w-1/5">序号</span>
                <span class="w-1/5">学号</span>
                <span class="w-1/5">姓名</span>
                <span class="w-1/5">年龄</span>
                <div class="flex grow justify-around">操作</div>
            </li>
            <li v-for="(item, index) in userList" :key="item.id" class="list-none flex justify-start items-center h-16 border-b border-solid border-gray-700">
                <span class="w-1/5">{{ index + 1 }}</span>
                <span class="w-1/5">{{ item.id }}</span>
                <span class="w-1/5">{{ item.userName }}</span>
                <span class="w-1/5">{{ item.age }}</span>
                <div class="flex grow justify-around">
                    <button class="text-white w-20 h-10 bg-gray-700" @click="deleteUser(index)">删除</button>
                    <button class="text-white w-20 h-10 bg-gray-700" @click="editUser(index)">编辑</button>
                    <button class="text-white w-20 h-10 bg-gray-700" @click="getYourName(item.id)">问名字</button>
                </div>
            </li>
        </ul> -->
        <a-table :columns="columns" :data-source="userList" class="px-20">
            <template #bodyCell="{ column, index, record }">
                <template v-if="column.key === 'id'">
                    <a>{{ index + 1 }}</a>
                </template>
                <template v-else-if="column.key === 'action'">
                    <a-space>
                        <a-button type="primary" @click="editUser(index)" :disabled="disabled">弹窗编辑</a-button>
                        <a-button type="primary" @click="submitFn" v-if="showbtn">确定</a-button>
                        <a-button type="primary" :ghost="editIndex === index + 1" @click="editUser2(index)">
                            {{ editIndex !== index + 1 ? '行内编辑' : '取消' }}
                        </a-button>
                        <a-button type="primary" danger @click="deleteUser(index)">删除</a-button>
                        <a-button @click="getYourName(record.num)">问名字</a-button>
                    </a-space>
                </template>

                <template v-if="index + 1 === editIndex && column.key === 'num'">
                    <a-input v-model:value="studyNum" placeholder="请输入学号" />
                </template>
                <template v-if="index + 1 === editIndex && column.key === 'userName'">
                    <a-input v-model:value="name" placeholder="请输入姓名" />
                </template>
                <template v-if="index + 1 === editIndex && column.key === 'age'">
                    <a-input v-model:value="year" placeholder="请输入年龄" />
                </template>
            </template>
        </a-table>

        <!-- <div class="border-gray-700 absolute bg-white rounded-lg top-1/2 left-1/2 w-1/3 h-1/2 -translate-x-1/2 -translate-y-1/2 p-6 border border-solid flex flex-col" v-if="showFlag">
            <div class="text-center text-2xl">{{ isEdit ? '编辑同学' : '新增同学' }}</div>
            <div class="grow shrink flex flex-col justify-center">
                <div class="flex h-20 text-2xl items-center">
                    <span class="mr-3 text-xl">学号</span>
                    <input class="grow shrink h-9 text-xl border border-solid border-black" type="text" v-model="studyNum" />
                </div>
                <div class="flex h-20 text-2xl items-center">
                    <span class="mr-3 text-xl">姓名</span>
                    <input class="grow shrink h-9 text-xl border border-solid border-black" type="text" v-model="name" />
                </div>
                <div class="flex h-20 text-2xl items-center">
                    <span class="mr-3 text-xl">年龄</span>
                    <input class="grow shrink h-9 text-xl border border-solid border-black" type="text" v-model="year" />
                </div>
            </div>
            <div class="flex justify-end w-full">
                <button class="mr-3 bg-white border border-solid border-blue-500 text-blue-500 w-20 h-10" @click="cancelFn">取消</button>
                <button class="text-white bg-blue-500 w-20 h-10" @click="submitFn">确定</button>
            </div>
        </div> -->

        <a-modal v-model:open="showFlag" :title="isEdit ? '编辑同学' : '新增同学'" centered @ok="submitFn" @cancel="showFlag = false">
            <a-form-item label="学号" name="studyNum" :rules="[{ required: true, message: '学号不能为空！' }]">
                <a-input v-model:value="studyNum" placeholder="请输入学号" />
            </a-form-item>
            <a-form-item label="姓名" name="name" :rules="[{ required: true, message: '姓名不能为空！' }]">
                <a-input v-model:value="name" placeholder="请输入姓名" />
            </a-form-item>
            <a-form-item label="年龄" name="year" :rules="[{ required: true, message: '年龄不能为空！' }]">
                <a-input v-model:value="year" placeholder="请输入年龄" />
            </a-form-item>
        </a-modal>
    </div>
    <!-- 图表 -->
    <div class="flex justify-center">
        <div id="myChart" style="width: 500px; height: 500px"></div>
    </div>
</template>

<script setup>
    import { ref, watch, onMounted } from 'vue';
    import { storeToRefs } from 'pinia';
    import { useUserStore } from '@/store/user';
    import * as echarts from 'echarts';

    const userStore = useUserStore();
    const { userList } = storeToRefs(userStore);

    let showFlag = ref(false);
    let showbtn = ref(false);
    let isEdit = ref(false);
    let curIdx = ref(0);
    let editIndex = ref(-1);
    let disabled = ref(false);

    let studyNum = ref(0);
    let name = ref('');
    let year = ref(0);

    var myChart = null;

    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '学号',
            dataIndex: 'num',
            key: 'num',
        },
        {
            title: '姓名',
            dataIndex: 'userName',
            key: 'userName',
        },
        {
            title: '年龄',
            key: 'age',
            dataIndex: 'age',
        },
        {
            title: '操作',
            key: 'action',
        },
    ];

    onMounted(() => {
        myChart = echarts.init(document.getElementById('myChart'));
        Upchart();
    });

    const Upchart = () => {
        var option = {
            xAxis: {
                type: 'category',
                data: userStore.userList.map((item) => {
                    return item.userName;
                }),
            },
            yAxis: {
                type: 'value',
            },
            series: [
                {
                    data: userStore.userList.map((item) => {
                        return item.age;
                    }),
                    type: 'bar',
                },
            ],
        };
        myChart.setOption(option);
    };

    watch(
        () => userStore.userList,
        (newValue, oldValue) => {
            Upchart();
        },
        { deep: true }
    );

    const deleteUser = (index) => {
        userStore.userList.splice(index, 1);
    };

    // 新增
    const addUser = () => {
        isEdit.value = false;
        showFlag.value = true;
        studyNum.value = 0;
        name.value = '';
        year.value = 0;
    };

    // 弹窗编辑
    const editUser = (index) => {
        isEdit.value = true;
        showFlag.value = true;
        curIdx.value = index;
        const item = userStore.userList[index];
        studyNum.value = item.num;
        name.value = item.userName;
        year.value = item.age;
    };

    // 行内编辑
    const editUser2 = (index) => {
        if (editIndex.value !== index + 1) {
            editIndex.value = index + 1;
            showbtn.value = true;
            disabled.value = true;
            curIdx.value = index;
            const item = userStore.userList[index];
            studyNum.value = item.num;
            name.value = item.userName;
            year.value = item.age;
        } else {
            editIndex.value = 0;
            showbtn.value = false;
            disabled.value = false;
        }
    };

    const checkList = (code) => {
        for (let index = 0; index < userStore.userList.length; index++) {
            const element = userStore.userList[index];
            if (Number(code) === element.num) {
                return true;
            }
        }
        return false;
    };

    const addNum2name = (name) => {
        // 将姓名后面追加最新编号
        let total = 0;
        userStore.userList.map((item) => {
            if (item.userName.indexOf(name) !== -1) {
                let tempItem = item;
                let tempItemName = tempItem.userName.split('');
                tempItemName.splice(0, name.length);
                let checkItem = isNum(tempItemName.join(''));
                if (tempItemName.length === 0 || checkItem) {
                    total++;
                }
            }
        });
        return `${name}${total === 0 ? '' : total}`;
    };

    const isNum = (val) => {
        let exg = /^\d+$/;
        if (!exg.test(val)) {
            return false;
        }
        return true;
    };

    const submitFn = () => {
        // 输入内容校验
        let studyNumCheck = isNum(studyNum.value);
        if (!studyNumCheck) {
            alert('学号需要为纯数字');
            return;
        }

        let tempName = addNum2name(name.value);
        if (isEdit.value || showbtn.value) {
            // 编辑
            userStore.userList.splice(curIdx.value, 1);
            tempName = name.value;
        }

        let isStudyNumExist = checkList(studyNum.value);
        if (isStudyNumExist) {
            alert('学号已存在');
            return;
        }

        userStore.userList.unshift({
            num: studyNum.value,
            userName: tempName,
            age: year.value,
        });
        showFlag.value = false;
        editIndex.value = -1;
        showbtn.value = false;
        disabled.value = false;
    };

    const getYourName = (id) => {
        const student = userStore.userList.find((item) => item.num === id);
        alert(student.userName);
    };
</script>

<style lang="less" scoped></style>
