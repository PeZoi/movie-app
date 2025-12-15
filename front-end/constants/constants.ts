import { RatingOption } from "@/types/comment-type";

export const AVATAR_DEFAULT = 'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1';

export const RATING_OPTIONS: RatingOption[] = [
  { emoji: '😍', emoji_url: 'https://www.rophim.li/images/reviews/rate-5.webp', label: 'Tuyệt vời', value: 10 },
  { emoji: '😘', emoji_url: 'https://www.rophim.li/images/reviews/rate-4.webp', label: 'Phim hay', value: 8 },
  { emoji: '😊', emoji_url: 'https://www.rophim.li/images/reviews/rate-3.webp', label: 'Khá ổn', value: 6 },
  { emoji: '😕', emoji_url: 'https://www.rophim.li/images/reviews/rate-2.webp', label: 'Phim chán', value: 4 },
  { emoji: '🤮', emoji_url: 'https://www.rophim.li/images/reviews/rate-1.webp', label: 'Dở tệ', value: 2 },
];