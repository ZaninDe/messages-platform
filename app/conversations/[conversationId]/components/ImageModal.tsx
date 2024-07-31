'use client'

import Image from 'next/image'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from '@/components/ui/dialog'

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  src: string | null
}

const ImageModal = ({ isOpen, onClose, src }: ImageModalProps) => {
  if (!src) {
    return null
  }
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-80 h-80 rounded-sm bg-transparent">
        <DialogHeader>
          <DialogDescription>
            <Image
              alt="Image"
              className="object-cover rounded-md"
              fill
              src={src}
            />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default ImageModal
