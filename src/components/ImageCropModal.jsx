import React, { useState, useRef, useEffect } from 'react'
import { 
  X, 
  Check, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Move, 
  Crop as CropIcon,
  RefreshCw
} from 'lucide-react'

const ImageCropModal = ({ isOpen, imageSrc, onCancel, onCropComplete }) => {
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  
  const imageRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setZoom(1)
      setRotation(0)
      setOffset({ x: 0, y: 0 })
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, imageSrc])

  if (!isOpen || !imageSrc) return null

  const handleMouseDown = (e) => {
    if (e.cancelable) e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY) || 0
    setDragStart({ x: clientX - offset.x, y: clientY - offset.y })
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    if (e.cancelable) e.preventDefault()
    e.stopPropagation()
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY) || 0
    setOffset({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360)
  }

  const handleReset = () => {
    setZoom(1)
    setRotation(0)
    setOffset({ x: 0, y: 0 })
  }

  const getCroppedImage = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = imageRef.current

    if (!img) return

    const size = 300
    canvas.width = size
    canvas.height = size

    ctx.fillStyle = '#09090e'
    ctx.fillRect(0, 0, size, size)

    ctx.save()
    ctx.translate(size / 2, size / 2)
    ctx.rotate((rotation * Math.PI) / 180)

    const aspect = img.naturalWidth / img.naturalHeight || 1
    let drawWidth = size * zoom
    let drawHeight = (size / aspect) * zoom

    if (aspect < 1) {
      drawHeight = size * zoom
      drawWidth = size * aspect * zoom
    }

    const panX = offset.x * (size / 240)
    const panY = offset.y * (size / 240)

    ctx.drawImage(
      img,
      -drawWidth / 2 + panX,
      -drawHeight / 2 + panY,
      drawWidth,
      drawHeight
    )

    ctx.restore()

    canvas.toBlob((blob) => {
      if (!blob) return
      const croppedFile = new File([blob], 'profile_cropped.jpg', { type: 'image/jpeg' })
      const previewUrl = URL.createObjectURL(blob)
      onCropComplete(croppedFile, previewUrl)
    }, 'image/jpeg', 0.92)
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md card p-6 space-y-5 border border-white/15 shadow-2xl bg-[#0d0d14] relative rounded-3xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CropIcon className="w-5 h-5 text-orange-400" />
            <span>Adjust & Crop Profile Picture</span>
          </h3>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-400 hover:text-white p-1 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Interactive Crop Mask Viewport */}
        <div className="space-y-4">
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
            className="relative w-60 h-60 mx-auto rounded-full overflow-hidden border-4 border-orange-500/80 shadow-2xl bg-[#05050a] cursor-move flex items-center justify-center select-none touch-none overscroll-none"
          >
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Crop target"
              className="max-w-none pointer-events-none transition-transform duration-75"
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                height: '100%',
                objectFit: 'contain'
              }}
            />
            {/* Circle Overlay Grid Guide */}
            <div className="absolute inset-0 rounded-full border border-white/30 pointer-events-none" />
          </div>

          <p className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1">
            <Move className="w-3 h-3 text-orange-400" />
            <span>Drag image to position inside the circle</span>
          </p>

          {/* Control Bar */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            
            {/* Zoom Slider */}
            <div className="flex items-center gap-3">
              <ZoomOut className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <ZoomIn className="w-4 h-4 text-orange-400 shrink-0" />
            </div>

            {/* Quick Action Controls */}
            <div className="flex items-center justify-center gap-3 pt-1 border-t border-white/10">
              <button
                type="button"
                onClick={handleRotate}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 flex items-center gap-1.5 border border-white/10 cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5 text-purple-400" />
                <span>Rotate 90°</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 flex items-center gap-1.5 border border-white/10 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                <span>Reset</span>
              </button>
            </div>

          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary text-xs px-4 py-2.5 rounded-xl font-semibold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={getCroppedImage}
              className="btn-sunset text-xs px-5 py-2.5 rounded-xl font-bold shadow-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Crop & Apply</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  )
}

export default ImageCropModal
