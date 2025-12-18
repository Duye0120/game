// @ts-nocheck
import { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';
import { Hands, Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

type SceneMode = 'EXPLODE' | 'TREE';

// 创建立体五角星几何体
function createStarGeometry() {
  const shape = new THREE.Shape();
  const outerRadius = 1.8;
  const innerRadius = 0.7;

  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i * Math.PI) / 5 - Math.PI / 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();

  const extrudeSettings = { depth: 0.5, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1, bevelSegments: 2 };
  return new THREE.ExtrudeGeometry(shape, extrudeSettings);
}

interface ParticleData {
  currentPos: THREE.Vector3;
  nebulaPos: THREE.Vector3;
  treePos: THREE.Vector3;
  color: THREE.Color;
  baseScale: number;
  phase: number;
}

// 粒子系统
const ParticleSystem = ({ mode }: { mode: SceneMode }) => {
  const count = 4000;
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const starRef = useRef<THREE.Group>(null!);

  const particles = useMemo(() => {
    const temp: ParticleData[] = [];
    // 更高级的配色：宝石色调
    const colors = [
      new THREE.Color("#FFD700").multiplyScalar(1.5), // 明亮金色
      new THREE.Color("#FF2D55").multiplyScalar(1.2), // 玫瑰红
      new THREE.Color("#30D158").multiplyScalar(1.3), // 翡翠绿
      new THREE.Color("#BF5AF2").multiplyScalar(1.2), // 紫水晶
      new THREE.Color("#FF9F0A").multiplyScalar(1.3), // 琥珀橙
    ];

    for (let i = 0; i < count; i++) {
      // 星云形态：多层球壳分布，更有层次感
      const layer = Math.floor(Math.random() * 3);
      const baseR = 8 + layer * 8;
      const r = baseR + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const nebulaPos = new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );

      // 圣诞树形态：更自然的锥形分布
      const t = Math.random();
      const h = t * 18;
      const maxRadius = (1 - t * 0.85) * 9;
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.sqrt(Math.random()) * maxRadius;
      const treePos = new THREE.Vector3(
        Math.cos(angle) * radius,
        h - 9,
        Math.sin(angle) * radius
      );

      temp.push({
        currentPos: nebulaPos.clone(),
        nebulaPos,
        treePos,
        color: colors[Math.floor(Math.random() * colors.length)],
        baseScale: 0.08 + Math.random() * 0.15,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return temp;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorsInit = useRef(false);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const lerp = mode === 'TREE' ? 0.04 : 0.03;

    if (!colorsInit.current && meshRef.current) {
      particles.forEach((p, i) => meshRef.current.setColorAt(i, p.color));
      meshRef.current.instanceColor!.needsUpdate = true;
      colorsInit.current = true;
    }

    particles.forEach((p, i) => {
      const target = mode === 'TREE' ? p.treePos : p.nebulaPos;
      p.currentPos.lerp(target, lerp);

      dummy.position.copy(p.currentPos);

      // 呼吸效果
      const breathe = 1 + Math.sin(t * 2 + p.phase) * 0.15;
      dummy.scale.setScalar(p.baseScale * breathe);

      // 爆炸模式下的漂浮
      if (mode === 'EXPLODE') {
        dummy.position.x += Math.sin(t * 0.5 + p.phase) * 0.3;
        dummy.position.y += Math.cos(t * 0.7 + p.phase) * 0.2;
      }

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;

    // 星星动画
    if (starRef.current) {
      const isTree = mode === 'TREE';
      starRef.current.position.y = THREE.MathUtils.lerp(starRef.current.position.y, isTree ? 11.5 : 30, 0.03);
      starRef.current.scale.setScalar(THREE.MathUtils.lerp(starRef.current.scale.x, isTree ? 1.2 : 0, 0.05));
      starRef.current.rotation.y = t * 0.3;
      starRef.current.rotation.z = Math.sin(t) * 0.05;
    }
  });

  return (
    <>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      {/* 顶部立体五角星 */}
      <group ref={starRef} position={[0, 30, 0]}>
        <mesh geometry={createStarGeometry()}>
          <meshBasicMaterial color="#FFD700" toneMapped={false} />
        </mesh>
        <pointLight color="#FFD700" intensity={50} distance={20} decay={2} />
      </group>
    </>
  );
};

// 背景星空
const Starfield = () => {
  const ref = useRef<THREE.Points>(null!);
  const count = 500;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 50 + Math.random() * 100;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.5} color="#ffffff" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
};

export default function ChristmasTree() {
  const [started, setStarted] = useState(false);
  const [mode, setMode] = useState<SceneMode>('EXPLODE');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modeRef = useRef<SceneMode>('EXPLODE');

  const startExperience = async () => {
    setLoading(true);
    setError(null);
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setStarted(true);
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') setError('请允许摄像头权限后重试');
        else if (err.name === 'NotFoundError') setError('未检测到摄像头设备');
        else setError(`摄像头启动失败: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!started) return;

    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });
    hands.setOptions({ maxNumHands: 1, modelComplexity: 1, minDetectionConfidence: 0.7, minTrackingConfidence: 0.5 });
    hands.onResults(onResults);

    if (videoRef.current) {
      const camera = new Camera(videoRef.current, {
        onFrame: async () => { if (videoRef.current) await hands.send({ image: videoRef.current }); },
        width: 640, height: 480,
      });
      camera.start();
    }
  }, [started]);

  const onResults = (results: Results) => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    if (results.multiHandLandmarks?.[0]) {
      const landmarks = results.multiHandLandmarks[0];

      // 绘制骨架
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.8)';
      ctx.lineWidth = 2;
      const connections = [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [0, 9], [9, 10], [10, 11], [11, 12], [0, 13], [13, 14], [14, 15], [15, 16], [0, 17], [17, 18], [18, 19], [19, 20], [5, 9], [9, 13], [13, 17]];
      connections.forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(landmarks[a].x * 320, landmarks[a].y * 240);
        ctx.lineTo(landmarks[b].x * 320, landmarks[b].y * 240);
        ctx.stroke();
      });

      landmarks.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x * 320, p.y * 240, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#FF2D55';
        ctx.fill();
      });

      const wrist = landmarks[0];
      const avgDist = [8, 12, 16, 20].reduce((sum, i) =>
        sum + Math.hypot(landmarks[i].x - wrist.x, landmarks[i].y - wrist.y), 0) / 4;

      const newMode = avgDist < 0.22 ? 'TREE' : 'EXPLODE';
      if (modeRef.current !== newMode) {
        setMode(newMode);
        modeRef.current = newMode;
      }
    }
  };

  if (!started) {
    return (
      <div style={{ width: '100vw', height: '100vh', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'fixed', top: 0, left: 0 }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 8vw, 5rem)',
          fontWeight: 300,
          letterSpacing: '0.3em',
          background: 'linear-gradient(135deg, #FFD700 0%, #FFF8DC 50%, #FFD700 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 60px rgba(255, 215, 0, 0.5)',
          marginBottom: '3rem',
          fontFamily: 'Georgia, serif',
        }}>
          圣诞快乐
        </h1>
        {error && (
          <div style={{ marginBottom: '1.5rem', padding: '1rem 2rem', background: 'rgba(255, 45, 85, 0.2)', border: '1px solid rgba(255, 45, 85, 0.5)', borderRadius: '4px', color: '#FF2D55', fontSize: '0.9rem' }}>
            ⚠️ {error}
          </div>
        )}
        <button
          onClick={startExperience}
          disabled={loading}
          style={{
            padding: '1rem 3rem',
            fontSize: '1.2rem',
            fontWeight: 300,
            letterSpacing: '0.2em',
            color: '#FFD700',
            background: 'transparent',
            border: '1px solid rgba(255, 215, 0, 0.5)',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s',
            opacity: loading ? 0.5 : 1,
          }}
          onMouseOver={e => { if (!loading) { e.currentTarget.style.background = 'rgba(255, 215, 0, 0.1)'; e.currentTarget.style.borderColor = '#FFD700'; } }}
          onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.5)'; }}
        >
          {loading ? '正在请求权限...' : '开始体验'}
        </button>
        <p style={{ marginTop: '2rem', color: 'rgba(255, 215, 0, 0.4)', fontSize: '0.9rem', letterSpacing: '0.1em' }}>
          需要摄像头权限来识别手势
        </p>
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000', position: 'fixed', top: 0, left: 0, overflow: 'hidden' }}>
      {/* 标题 */}
      <div style={{ position: 'absolute', top: '2rem', width: '100%', textAlign: 'center', zIndex: 10, pointerEvents: 'none' }}>
        <h1 style={{
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
          fontWeight: 300,
          letterSpacing: '0.4em',
          background: 'linear-gradient(135deg, #FFD700 0%, #FFF8DC 50%, #FFD700 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: 0,
          fontFamily: 'Georgia, serif',
        }}>
          圣诞快乐
        </h1>
      </div>

      {/* 3D 场景 */}
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 30], fov: 60 }}>
        <color attach="background" args={['#030308']} />
        <fog attach="fog" args={['#030308', 30, 80]} />

        <Starfield />
        <ParticleSystem mode={mode} />

        <EffectComposer>
          <Bloom luminanceThreshold={0.4} intensity={0.6} radius={0.4} mipmapBlur />
          <ChromaticAberration offset={[0.0003, 0.0003]} />
        </EffectComposer>
      </Canvas>

      {/* 状态指示器 */}
      <div style={{ position: 'absolute', bottom: '12rem', left: '1.5rem', zIndex: 10 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem',
          color: mode === 'EXPLODE' ? '#FF2D55' : 'rgba(255,255,255,0.2)',
          fontSize: '0.75rem', letterSpacing: '0.15em', fontFamily: 'monospace',
          transition: 'all 0.3s',
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: mode === 'EXPLODE' ? '#FF2D55' : 'rgba(255,255,255,0.2)', boxShadow: mode === 'EXPLODE' ? '0 0 10px #FF2D55' : 'none' }} />
          星云
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          color: mode === 'TREE' ? '#30D158' : 'rgba(255,255,255,0.2)',
          fontSize: '0.75rem', letterSpacing: '0.15em', fontFamily: 'monospace',
          transition: 'all 0.3s',
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: mode === 'TREE' ? '#30D158' : 'rgba(255,255,255,0.2)', boxShadow: mode === 'TREE' ? '0 0 10px #30D158' : 'none' }} />
          圣诞树
        </div>
      </div>

      {/* 手势提示 */}
      <div style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', zIndex: 10, textAlign: 'right' }}>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', margin: 0, letterSpacing: '0.1em' }}>✋ 张开手掌 → 星云</p>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', margin: 0, letterSpacing: '0.1em' }}>✊ 握紧拳头 → 圣诞树</p>
      </div>

      <video ref={videoRef} style={{ display: 'none' }} playsInline />

      {/* 监控窗口 */}
      <div style={{
        position: 'absolute', bottom: '1.5rem', left: '1.5rem',
        width: '160px', height: '120px',
        border: '1px solid rgba(255, 215, 0, 0.2)',
        borderRadius: '4px',
        overflow: 'hidden',
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(10px)',
      }}>
        <canvas ref={canvasRef} width={320} height={240} style={{ width: '100%', height: '100%', transform: 'scaleX(-1)' }} />
      </div>
    </div>
  );
}
