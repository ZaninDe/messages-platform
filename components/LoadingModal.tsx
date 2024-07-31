import { ImSpinner9 } from 'react-icons/im'

const LoadingModal = () => {
  return (
    <div className="w-screen h-screen top-0 z-50 left-0 fixed bg-white/90 flex justify-center items-center">
      <ImSpinner9 size={32} className="animate-spin" />
    </div>
  )
}

export default LoadingModal
