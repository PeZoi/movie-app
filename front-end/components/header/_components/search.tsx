import { SearchIcon } from 'lucide-react'

export default function Search() {
  return (
    <div className='flex items-center gap-2 max-w-92 relative text-white w-full'>
      <SearchIcon className='absolute left-4' size={18} strokeWidth={3.5} />
      <input 
        type="text" 
        placeholder="Tìm kiếm phim, diễn viên" 
        autoComplete='off' 
        className='bg-[rgba(255,255,255,.08)] text-white placeholder:text-white outline-none w-full h-11 leading-8 text-sm px-12 py-1.5 rounded-lg focus:border-white border border-transparent' 
      />
    </div>
  )
}
