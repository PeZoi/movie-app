import { Button } from '@/components/ui/button';

interface SocialLoginButtonsProps {
  text?: string;
}

export default function SocialLoginButtons({ text = 'Hoặc đăng nhập với' }: SocialLoginButtonsProps) {
  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#3A4563]"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-[#1E2545] text-gray-400">{text}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          className="h-11 bg-[#2A3453] border-[#3A4563] text-white hover:bg-[#3A4563] hover:text-white"
        >
          Google
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11 bg-[#2A3453] border-[#3A4563] text-white hover:bg-[#3A4563] hover:text-white"
        >
          Facebook
        </Button>
      </div>
    </>
  );
}
