import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

// Cấu hình dayjs với plugin relativeTime và locale tiếng Việt
dayjs.extend(relativeTime);
dayjs.locale('vi');

// Export dayjs đã được cấu hình để sử dụng ở các component khác
export default dayjs;

