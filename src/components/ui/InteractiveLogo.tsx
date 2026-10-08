'use client'

import React, { useEffect, useRef, useCallback, type CSSProperties } from 'react'

interface InteractiveLogoProps {
  text?: string
  fontSize?: number
  fontWeight?: number
  fontFamily?: string
  textColor?: string
  displacementForce?: number
  rgbShiftStrength?: number
  mouseRadius?: number
  decaySpeed?: number
  className?: string
  style?: CSSProperties
}

const VERT_SRC = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
    v_uv = (a_pos + 1.0) * 0.5;
    v_uv.y = 1.0 - v_uv.y;
    gl_Position = vec4(a_pos, 0.0, 1.0);
}
`

const FRAG_SRC = `
precision highp float;
uniform vec2 u_res;
uniform vec2 u_mouse;
uniform vec2 u_mouse_vel;
uniform float u_hover;
uniform float u_radius;
uniform float u_force;
uniform float u_rgbShift;
uniform vec3 u_textColor;
uniform sampler2D u_textTex;
varying vec2 v_uv;

void main() {
    vec2 pixelPos = gl_FragCoord.xy;
    float dist = distance(pixelPos, u_mouse);

    // Compute distortion field from mouse velocity
    float falloff = smoothstep(u_radius, 0.0, dist) * u_hover;
    vec2 displacement = u_mouse_vel * falloff * u_force * 0.0008;

    vec2 finalUvs = v_uv - displacement;

    // Chromatic aberration separation
    float dispLen = clamp(length(displacement) * 50.0, 0.0, 2.0);
    vec2 shift = displacement * u_rgbShift;

    float redStrength = 1.0 + dispLen * 0.25;
    float greenStrength = 1.0 + dispLen * 2.0;
    float blueStrength = 1.0 + dispLen * 1.5;

    vec2 redUvs = finalUvs + shift * redStrength;
    vec2 greenUvs = finalUvs + shift * greenStrength;
    vec2 blueUvs = finalUvs + shift * blueStrength;

    // Sample alpha mask for 3 channels
    float aR = texture2D(u_textTex, redUvs).a;
    float aG = texture2D(u_textTex, greenUvs).a;
    float aB = texture2D(u_textTex, blueUvs).a;

    float maxAlpha = max(aR, max(aG, aB));

    if (maxAlpha < 0.01) {
        discard;
    }

    // Core region where 3 channels overlap
    float core = min(aR, min(aG, aB));

    // RGB fringe dispersion on stretched edges
    vec3 fringe = vec3(aR, aG, aB);

    // Mix: Core holds textColor, fringe scatters RGB dispersion
    vec3 finalColor = mix(fringe, u_textColor, core);

    gl_FragColor = vec4(finalColor, maxAlpha);
}
`

function parseHexColor(color: string): [number, number, number] {
  if (!color) return [0, 0, 0]
  let clean = color.replace('#', '').trim()
  if (clean.length === 8) {
    clean = clean.substring(0, 6)
  }
  if (clean.length === 3) {
    return [
      parseInt(clean[0] + clean[0], 16) / 255,
      parseInt(clean[1] + clean[1], 16) / 255,
      parseInt(clean[2] + clean[2], 16) / 255,
    ]
  }
  if (clean.length === 6) {
    return [
      parseInt(clean.substring(0, 2), 16) / 255,
      parseInt(clean.substring(2, 4), 16) / 255,
      parseInt(clean.substring(4, 6), 16) / 255,
    ]
  }
  return [0, 0, 0]
}

export function InteractiveLogo({
  text = 'GOODMOTION',
  fontSize = 140,
  fontWeight = 900,
  fontFamily = 'Impact, sans-serif',
  textColor = '#000000',
  displacementForce = 2,
  rgbShiftStrength = 0.06,
  mouseRadius = 130,
  decaySpeed = 0.06,
  className = '',
  style,
}: InteractiveLogoProps) {
  const resolvedFont = fontFamily && fontFamily.trim().length > 0 ? fontFamily.trim() : 'Impact, sans-serif'

  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const textureRef = useRef<WebGLTexture | null>(null)
  const glRef = useRef<WebGLRenderingContext | null>(null)

  const mousePosRef = useRef({ x: -9999, y: -9999 })
  const lastMousePosRef = useRef({ x: -9999, y: -9999 })
  const mouseVelRef = useRef({ x: 0, y: 0 })
  const targetHoverRef = useRef(0)
  const hoverValRef = useRef(0)
  const animRef = useRef<number | null>(null)

  const updateTextTexture = useCallback(() => {
    const gl = glRef.current
    const texture = textureRef.current
    const canvas = canvasRef.current
    if (!gl || !texture || !canvas) return

    if (!maskCanvasRef.current) {
      maskCanvasRef.current = document.createElement('canvas')
    }
    const mCanvas = maskCanvasRef.current
    mCanvas.width = canvas.width
    mCanvas.height = canvas.height
    const ctx = mCanvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const sample = 100
    ctx.font = `${fontWeight} ${sample}px ${resolvedFont}`
    const measured = ctx.measureText(text || 'GOODMOTION').width || 1
    const targetSize = Math.floor((canvas.width / measured) * sample)

    ctx.fillStyle = '#ffffff'
    ctx.font = `${fontWeight} ${targetSize}px ${resolvedFont}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, canvas.width / 2, canvas.height / 2)

    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mCanvas)
  }, [text, fontWeight, resolvedFont])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const gl = canvas.getContext('webgl', { alpha: true, antialias: true })
    if (!gl) return
    glRef.current = gl

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)
      if (!s) return null
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }

    const vs = compile(gl.VERTEX_SHADER, VERT_SRC)
    const fs = compile(gl.FRAGMENT_SHADER, FRAG_SRC)
    if (!vs || !fs) return

    const prog = gl.createProgram()
    if (!prog) return
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW)

    const aPos = gl.getAttribLocation(prog, 'a_pos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, 'u_res')
    const uMouse = gl.getUniformLocation(prog, 'u_mouse')
    const uMouseVel = gl.getUniformLocation(prog, 'u_mouse_vel')
    const uHover = gl.getUniformLocation(prog, 'u_hover')
    const uRadius = gl.getUniformLocation(prog, 'u_radius')
    const uForce = gl.getUniformLocation(prog, 'u_force')
    const uRgbShift = gl.getUniformLocation(prog, 'u_rgbShift')
    const uTextColor = gl.getUniformLocation(prog, 'u_textColor')

    const texture = gl.createTexture()
    textureRef.current = texture
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

    const handleResize = () => {
      const w = container.clientWidth || 900
      const h = container.clientHeight || 250
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      gl.viewport(0, 0, canvas.width, canvas.height)

      if (document.fonts) {
        document.fonts.ready.then(() => updateTextTexture())
      } else {
        updateTextTexture()
      }
    }

    handleResize()
    const ro = new ResizeObserver(handleResize)
    ro.observe(container)

    const handleWindowPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      const inside =
        e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom

      if (inside) {
        const currentX = e.clientX - rect.left
        const currentY = e.clientY - rect.top

        if (lastMousePosRef.current.x !== -9999) {
          const dx = currentX - lastMousePosRef.current.x
          const dy = currentY - lastMousePosRef.current.y
          mouseVelRef.current.x += dx * 0.8
          mouseVelRef.current.y += dy * 0.8
        }

        lastMousePosRef.current = { x: currentX, y: currentY }
        mousePosRef.current = { x: currentX, y: currentY }
        targetHoverRef.current = 1.0
      } else {
        targetHoverRef.current = 0.0
        lastMousePosRef.current = { x: -9999, y: -9999 }
      }
    }

    window.addEventListener('pointermove', handleWindowPointerMove, { passive: true })

    const render = () => {
      mouseVelRef.current.x *= 1.0 - decaySpeed
      mouseVelRef.current.y *= 1.0 - decaySpeed

      hoverValRef.current += (targetHoverRef.current - hoverValRef.current) * 0.1

      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform2f(uMouse, mousePosRef.current.x * dpr, (container.clientHeight - mousePosRef.current.y) * dpr)
      gl.uniform2f(uMouseVel, mouseVelRef.current.x, -mouseVelRef.current.y)
      gl.uniform1f(uHover, hoverValRef.current)
      gl.uniform1f(uRadius, mouseRadius * dpr)
      gl.uniform1f(uForce, displacementForce)
      gl.uniform1f(uRgbShift, rgbShiftStrength)

      const rgb = parseHexColor(textColor)
      gl.uniform3f(uTextColor, rgb[0], rgb[1], rgb[2])

      gl.drawArrays(gl.TRIANGLES, 0, 6)
      animRef.current = requestAnimationFrame(render)
    }

    animRef.current = requestAnimationFrame(render)

    return () => {
      ro.disconnect()
      window.removeEventListener('pointermove', handleWindowPointerMove)
      if (animRef.current) cancelAnimationFrame(animRef.current)
      gl.deleteProgram(prog)
      if (texture) gl.deleteTexture(texture)
      glRef.current = null
      textureRef.current = null
    }
  }, [displacementForce, rgbShiftStrength, mouseRadius, decaySpeed, textColor, updateTextTexture])

  useEffect(() => {
    updateTextTexture()
  }, [updateTextTexture])

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-[1440/250] max-h-[250px] flex items-center justify-center overflow-hidden cursor-pointer select-none ${className}`}
      style={{ ...style }}
    >
      <canvas ref={canvasRef} className="block pointer-events-none" />
    </div>
  )
}
