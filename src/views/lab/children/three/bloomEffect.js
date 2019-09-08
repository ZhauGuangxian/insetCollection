require('three/examples/js/postprocessing/EffectComposer.js');

require('three/examples/js/postprocessing/ShaderPass.js');
require('three/examples/js/postprocessing/TexturePass.js');
require('three/examples/js/postprocessing/BloomPass.js');
require('three/examples/js/postprocessing/RenderPass.js');
require('three/examples/js/shaders/CopyShader.js');
// ConvolutionShader
require('three/examples/js/shaders/ConvolutionShader.js');
export function BloomEffect(renderer,scene,camera) {
    var composer = new THREE.EffectComposer(renderer);
    var renderPass = new THREE.RenderPass(scene,camera);
    //var renderScene = new THREE.TexturePass(composer.renderTarget2);
    var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
    effectCopy.renderToScreen = true;
    var bloomPass = new THREE.BloomPass(3,25,5,256);
    composer.addPass(renderPass);
    //composer.addPass(renderScene);
    composer.addPass(bloomPass);
    composer.addPass(effectCopy);
    return composer;
}
