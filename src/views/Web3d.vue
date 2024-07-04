<script setup>
    import { ref, onMounted, watch } from 'vue';
    import * as BABYLON from '@babylonjs/core';
    import '@babylonjs/loaders';
    import '@babylonjs/inspector';
    import { storeToRefs } from 'pinia';
    import { useUserStore } from '@/store/user';
    import * as echarts from 'echarts';

    const userStore = useUserStore();
    const { userList } = storeToRefs(userStore);

    const canvasRef = ref(null);
    const camera = ref(null);
    var myChart = null;

    const showModel = ({ position, target }) => {
        animateCamera('position', new BABYLON.Vector3(...position), camera.value);
        animateCamera('target', new BABYLON.Vector3(...target), camera.value);
    };

    // 视角切换过程中的过渡动画
    const animateCamera = (type, newPos, camera) => {
        const speed = 60;
        const frameCount = 240;

        const ease = new BABYLON.CubicEase();
        ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
        BABYLON.Animation.CreateAndStartAnimation('animation', camera, type, speed, frameCount, camera[type], newPos, 0, ease);
    };

    const initEngine = async () => {
        if (canvasRef.value) {
            const engine = new BABYLON.Engine(canvasRef.value, true);
            const scene = new BABYLON.Scene(engine);
            camera.value = new BABYLON.ArcRotateCamera('camera', Math.PI / 10, Math.PI / 3, 20, BABYLON.Vector3.Zero(), scene);

            camera.value.attachControl(canvasRef.value);
            camera.value.lowerBetaLimit = 0;
            camera.value.upperBetaLimit = Math.PI / 2;
            camera.value.lowerRadiusLimit = 3;
            camera.value.upperRadiusLimit = 40;

            const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), this);
            light.intensity = 1;
            light.specular = new BABYLON.Color3(1, 1, 0);

            BABYLON.SceneLoader.Append('/model/', 'library_draco.glb', scene, (meshes) => {
                showModel(animation);
            });

            engine.runRenderLoop(() => {
                scene.render();
            });

            scene.debugLayer.show({
                embedMode: true,
            });

            window.addEventListener('resize', () => {
                engine.resize();
            });
        }
    };

    onMounted(() => {
        initEngine();
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
</script>
<template>
    <!-- 模型 -->
    <div>
        <canvas ref="canvasRef" class="canvas"></canvas>
    </div>
    <!-- 图表 -->
    <div class="absolute top-5">
        <div id="myChart" style="width: 300px; height: 300px; background-color: white;"></div>
    </div>
</template>

<style scoped>
    .canvas {
        width: 100%;
        height: 90vh;
    }
</style>
