
import * as THREE from 'three';
import { OrbitControls } from './src/threejs/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from './src/threejs/examples/jsm/loaders/GLTFLoader.js';
import { KTX2Loader } from './src/threejs/examples/jsm/loaders/KTX2Loader.js';
import { MeshoptDecoder } from './src/threejs/examples/jsm/libs/meshopt_decoder.module.js';
const { ipcRenderer } = require('electron');
let camera, scene, renderer;

init();
render();

function init() {
    document.getElementById('confirm_area').addEventListener('click', function (){
        let area = document.getElementById("Area_select").value
        console.log('the area is ', area)
        ipcRenderer.once('set_area_result', (arg) => {
            console.log('the result is ', arg)
            if(arg == true){
                alert('设置成功')
            }
        })
        ipcRenderer.send('set_area', area)
    })

    const container = document.createElement( 'div' );
    document.body.appendChild( container );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.shadowMap.enabled = true;
    container.appendChild( renderer.domElement );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.set( 0, 5, 0 );

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xbbbbbb );

    const grid = new THREE.GridHelper( 500, 10, 0xffffff, 0xffffff );
    grid.material.opacity = 0.5;
    grid.material.depthWrite = false;
    grid.material.transparent = true;
    scene.add( grid );

    const ktx2Loader = new KTX2Loader()
        .setTranscoderPath( 'jsm/libs/basis/' )
        .detectSupport( renderer );

    const loader = new GLTFLoader().setPath( './src/model/' );
    loader.setKTX2Loader( ktx2Loader );
    loader.setMeshoptDecoder( MeshoptDecoder );
    loader.load( 'SEEED9B.gltf', function ( gltf ) {
        gltf.scene.scale.set(16, 16, 16)

        gltf.scene.position.set(-200,0, -100);

        gltf.scene.position.y = -10;


        const pointLight1 = new THREE.PointLight(0xffffff, 1000, 5000); // 参数分别是颜色、强度、距离
        pointLight1.position.set(35, 90, 75); // 设置光源的位置
        pointLight1.castShadow = true;


        scene.add(pointLight1); // 将光源添加到场景中


        const pointLight2 = new THREE.PointLight(0xffffff, 500, 80000); // 红色光源，强度0.8，距离80
        pointLight2.position.set(30, 150, 75);
        scene.add(pointLight2);


        const MidLight = new THREE.PointLight(0xffffff, 1000, 5000)
        MidLight.position.set(-40, 90, 75)


        const MidLightTwo = new THREE.PointLight(0xffffff, 1000, 5000)
        const MidLightThree = new THREE.PointLight(0xffffff, 1000, 5000)
        MidLightTwo.position.set(-40, 90, 25)
        MidLightThree.position.set(-40, 90, 125)
        scene.add(MidLight)
        scene.add(MidLightTwo)
        scene.add(MidLightThree)


        const TELight = new THREE.PointLight(0xffffff, 1000, 5000)
        TELight.position.set(-150, 90, 25)
        scene.add(TELight)

        const TELightTwo = new THREE.PointLight(0xffffff, 1000, 5000)
        TELightTwo.position.set(-150, 90, 75)
        scene.add(TELightTwo)

        const TELightThree = new THREE.PointLight(0xffffff, 1000, 5000)
        TELightThree.position.set(-150, 90, 125)
        scene.add(TELightThree)

        // 监听鼠标点击事件
        window.addEventListener('click', onMouseClick, false);

        function onMouseClick(event) {

            // 将浏览器坐标转换为标准设备坐标（-1, 1）
            const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

            // 使用摄像机和鼠标位置更新射线
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera({ x: mouseX, y: mouseY }, camera);

            // 计算物体和射线的交点
            const intersects = raycaster.intersectObjects(scene.children, true); // 第二个参数表示是否递归检查子对象

            if (intersects.length > 0) {

                // 如果有交点，则获取最近的交点
                const intersect = intersects[0];

                // 检查交点是否是一个mesh，并获取其名称
                if (intersect.object instanceof THREE.Mesh) {
                    const meshName = intersect.object.name;
                    console.log(`Clicked on mesh with name: ${meshName}`);
                    if(meshName == 'EEdesk1' || meshName == 'EEDesk'  || meshName == 'EEdesk'){
                        console.log('got the desk, the intensity is ', pointLight1.intensity)

                        if(pointLight1.intensity == 0){
                            ipcRenderer.send('clicked', 'EE-on')
                            pointLight1.intensity = 1000;
                            render()
                        }else{
                            ipcRenderer.send('clicked', 'EE-off')
                            pointLight1.intensity = 0;
                            render()
                        }
                    }else if(meshName == 'MidDesk1' || meshName == 'MidDesk'){

                        if(MidLight.intensity == 0){
                            ipcRenderer.send('clicked', 'Mid-on')
                            MidLight.intensity = 1000;
                            MidLightTwo.intensity = 1000;
                            MidLightThree.intensity = 1000;
                            render()
                        }else{
                            ipcRenderer.send('clicked', 'Mid-off')
                            MidLight.intensity = 0;
                            MidLightTwo.intensity = 0;
                            MidLightThree.intensity = 0;
                            render()
                        }
                    }else if(meshName == 'TEdesk' || meshName == 'TEdesk1'){
                        if(TELight.intensity == 0){
                            ipcRenderer.send('clicked', 'TE-on')
                            TELight.intensity = 1000;
                            TELightTwo.intensity = 1000;
                            TELightThree.intensity = 1000;
                            var event = new MouseEvent('clickTE', {
                                bubbles: true,
                                cancelable: true,
                                view: window
                            });
                            render()
                        }else{
                            ipcRenderer.send('clicked', 'TE-1')
                            TELight.intensity = 0;
                            TELightTwo.intensity = 0;
                            TELightThree.intensity = 0;

                            render()
                        }
                    }
                }
            } else {
                console.log('No intersection.');
            }
        }

        scene.add( gltf.scene );

        render();

    } );

    const controls = new OrbitControls( camera, renderer.domElement );
    controls.addEventListener( 'change', render ); // use if there is no animation loop
    controls.minDistance = 400;
    controls.maxDistance = 1000;
    controls.target.set( 10, 90, - 16 );
    controls.update();
    window.addEventListener( 'resize', onWindowResize );
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
    render();

}

//

function render() {
    renderer.render( scene, camera );
}
